type Version = {
  version: string;
  releaseDate: Date;
  fixes: string[];
  features: string[];
};

export const version = '0.1.0';
export const versionNotes: Version[] = [
  {
    version: '0.1.0',
    releaseDate: new Date('2024-04-10'),
    fixes: ['None'],
    features: ['Initial release']
  }
];
