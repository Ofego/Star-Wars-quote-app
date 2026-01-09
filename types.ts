export interface Quote {
  id: number;
  text: string;
  character: string;
  source: string;
  faction: 'jedi' | 'sith' | 'neutral';
}