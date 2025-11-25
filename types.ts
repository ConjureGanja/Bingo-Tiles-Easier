export interface BingoTile {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  evidence?: string; // URL or base64 of the proof image
  imageUrl: string; // URL for the OSRS icon
}

export type GridData = BingoTile[];