export type Thought = {
  id: string;
  content: string;
  entry: string;
  tags: string[];
  mood: number;
  create_at: string;
};

export type Tag = {
  id: string;
  name: string;
  description: string;
  colour: string;
};
