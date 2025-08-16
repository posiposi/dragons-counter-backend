import { Game } from '../../domain/entities/game';

export interface GameRepository {
  save(game: Game): Promise<Game>;
}
