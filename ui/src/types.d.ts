export type Thought = {
  id: string;
  content: string;
  entry: string;
  tags: string[];
  mood: number;
  actions: string;
};

export type Entry = {
  id: string;
  date: string;
  thoughts: Thought[];
};

export type Tag = {
  id: string;
  name: string;
  description: string;
  colour: string;
};

export type Task = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  notes: string;
  tags: Tag[];
  snooze: string | null;
  is_evergreen: boolean;
  is_completed: boolean;
  is_ideal: boolean;
};
