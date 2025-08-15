export interface CreateGameRequest {
  gameDate: string;
  opponent: string;
  dragonsScore: number;
  opponentScore: number;
  stadium: string;
  notes?: string;
}
