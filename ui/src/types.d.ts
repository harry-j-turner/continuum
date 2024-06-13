export type Thought = {
  id: string;
  content: string;
  tags: string[];
  created_at: string;
};

export type Tag = {
  id: string;
  name: string;
  description: string;
  colour: string;
};
