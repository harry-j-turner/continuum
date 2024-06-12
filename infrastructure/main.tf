provider "aws" {
  region  = "eu-west-2"
  profile = "personal"
}

terraform {
  backend "s3" {
    bucket         = "terraform.continuum-journal.com"
    key            = "production.tfstate"      
    region         = "eu-west-2"
    profile        = "personal"
    encrypt        = true
  }
}

variable "DB_NAME" {
  type = string
}

variable "DB_USER" {
  type = string
}

variable "DB_PASSWORD" {
  type = string
}

resource "aws_security_group" "dragon_road_access" {
  name        = "dragon_road_access"
  description = "Allow SSH inbound traffic from home IP address"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["82.37.52.190/32"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "continuum_db_access" {
  name        = "continuum_db_access"
  description = "Allow traffic from server to the PostgreSQL database"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    self        = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Server
########

resource "aws_iam_policy" "ecr_read_policy" {
  name        = "ecrReadPolicy"
  path        = "/"
  description = "Policy for reading from ECR"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = ["ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage", "ecr:BatchCheckLayerAvailability", "ecr:GetAuthorizationToken"],
        Effect   = "Allow",
        Resource = "*"
      },
    ],
  })
}


resource "aws_iam_role" "ec2_ecr_role" {
  name = "EC2ECRRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com",
        },
      },
    ],
  })
}

resource "aws_iam_role_policy_attachment" "ecr_read_policy_attachment" {
  role       = aws_iam_role.ec2_ecr_role.name
  policy_arn = aws_iam_policy.ecr_read_policy.arn
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2Profile"
  role = aws_iam_role.ec2_ecr_role.name
}

resource "aws_key_pair" "continuum_key" {
  key_name   = "continuum_key"
  public_key = file("/home/harry_turner/.ssh/api.continuum-journal.com.pub")
}

resource "aws_instance" "server" {
  ami           = "ami-0cfd0973db26b893b"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.continuum_key.key_name

  vpc_security_group_ids = [aws_security_group.dragon_road_access.id, aws_security_group.continuum_db_access.id]

  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

  user_data = <<-EOF
              #!/bin/bash           

              sudo yum install cronie -y
              sudo systemctl start crond
              sudo systemctl enable crond
              (crontab -l 2>/dev/null; echo "*/10 * * * * /home/ec2-user/watch.sh >> /home/ec2-user/watch.log 2>&1") | crontab -

              sudo yum install docker -y
              sudo service docker start
              sudo usermod -aG docker ec2-user
              sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              sudo chmod +x /usr/local/bin/docker-compose
              EOF
}

resource "aws_eip" "server_eip" {
  instance   = aws_instance.server.id
  domain     = "vpc"
  depends_on = [aws_instance.server]
}

resource "aws_route53_record" "api_record" {
  zone_id = "Z00953061OUITIBD14FFC"  # continuum-journal.com
  name    = "api.continuum-journal.com"
  type    = "A"
  ttl     = "300"
  records = [aws_eip.server_eip.public_ip]
}

resource "aws_db_instance" "continuum_db" {
  allocated_storage = 10
  engine = "postgres"
  db_name= var.DB_NAME
  identifier = "continuum-db"
  storage_encrypted = true
  instance_class = "db.t3.micro"
  username = var.DB_USER
  password = var.DB_PASSWORD
  skip_final_snapshot = true
  vpc_security_group_ids = [aws_security_group.continuum_db_access.id]
}

resource "aws_ecr_repository" "continuum" {
  name                 = "continuum"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }
}
