import { Game } from '../entities/game';

export interface GamePort {
  save(game: Game): Promise<Game>;
  findAll(): Promise<Game[]>;
}
