# Generated by Django 4.2.4 on 2024-06-06 08:17

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ("thought", "0003_thought_actions_thought_mood"),
    ]

    operations = [
        migrations.CreateModel(
            name="Task",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=100)),
                ("notes", models.TextField(blank=True)),
                ("snooze", models.DateTimeField(null=True)),
                ("is_evergreen", models.BooleanField(default=False)),
                ("is_completed", models.BooleanField(default=False)),
                ("is_ideal", models.BooleanField(default=False)),
                ("tags", models.ManyToManyField(blank=True, to="thought.tag")),
            ],
        ),
    ]
