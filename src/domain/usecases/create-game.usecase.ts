import { Game } from '../entities/game';
import { GameId } from '../value-objects/game-id';
import { Opponent } from '../value-objects/opponent';
import { Score } from '../value-objects/score';
import { Stadium } from '../value-objects/stadium';
import { Notes } from '../value-objects/notes';
import { GameDate } from '../value-objects/game-date';
import type { GameRepository } from '../../application/interfaces/game-repository.interface';
import { CreateGameRequest } from '../../application/dtos/create-game.dto';
import { randomUUID } from 'crypto';
import { Inject } from '@nestjs/common';

export class CreateGameUseCase {
  constructor(
    @Inject('GameRepository')
    private readonly gameRepository: GameRepository,
  ) {}

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
