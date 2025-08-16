import { Game } from '../../domain/entities/game';
import { GameId } from '../../domain/value-objects/game-id';
import { Opponent } from '../../domain/value-objects/opponent';
import { Score } from '../../domain/value-objects/score';
import { Stadium } from '../../domain/value-objects/stadium';
import { Notes } from '../../domain/value-objects/notes';
import { GameDate } from '../../domain/value-objects/game-date';
import { GameRepository } from '../interfaces/game-repository.interface';
import { CreateGameRequest } from '../dtos/create-game.dto';
import { randomUUID } from 'crypto';

export class CreateGameUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(request: CreateGameRequest): Promise<Game> {
    const gameDate = this.parseGameDate(request.gameDate);

    const game = new Game(
      new GameId(randomUUID()),
      new GameDate(gameDate),
      new Opponent(request.opponent),
      new Score(request.dragonsScore),
      new Score(request.opponentScore),
      new Stadium(request.stadium),
      new Notes(request.notes || null),
      new Date(),
      new Date(),
    );

    return await this.gameRepository.save(game);
  }

  private parseGameDate(dateString: string): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }
    return date;
  }
}
