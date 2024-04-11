type Version = {
  version: string;
  releaseDate: Date;
  fixes: string[];
  features: string[];
};

export const version = '0.1.1';
export const versionNotes: Version[] = [
  {
    version: '0.1.1',
    releaseDate: new Date('2024-04-11'),
    fixes: [
      'Email report was not properly collecting last seven days of thoughts.',
      'Thought entry textbox was not updating state properly.'
    ],
    features: ['None']
  },
  {
    version: '0.1.0',
    releaseDate: new Date('2024-04-10'),
    fixes: ['None'],
    features: ['Initial release']
  }
];
