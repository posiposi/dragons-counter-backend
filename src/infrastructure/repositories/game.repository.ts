import { Injectable } from '@nestjs/common';
import { PrismaClient, Game as PrismaGame } from '@prisma/client';
import { Game } from '../../domain/entities/game';
import { GameId } from '../../domain/value-objects/game-id';
import { Score } from '../../domain/value-objects/score';
import { Opponent } from '../../domain/value-objects/opponent';
import { Stadium } from '../../domain/value-objects/stadium';
import { Notes } from '../../domain/value-objects/notes';
import { GameDate } from '../../domain/value-objects/game-date';

@Injectable()
export class GameRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(game: Game): Promise<Game> {
    const savedGame = await this.prisma.game.upsert({
      where: {
        id: game.id.value,
      },
      update: {
        gameDate: game.gameDate.value,
        opponent: game.opponent.value,
        dragonsScore: game.dragonsScore.value,
        opponentScore: game.opponentScore.value,
        stadium: game.stadium.value,
        result: game.result.value,
        notes: game.notes?.value || null,
        updatedAt: new Date(),
      },
      create: {
        id: game.id.value,
        gameDate: game.gameDate.value,
        opponent: game.opponent.value,
        dragonsScore: game.dragonsScore.value,
        opponentScore: game.opponentScore.value,
        stadium: game.stadium.value,
        result: game.result.value,
        notes: game.notes?.value || null,
      },
    });

    return this.toDomainEntity(savedGame);
  }

  private toDomainEntity(data: PrismaGame): Game {
    return new Game(
      new GameId(data.id),
      new GameDate(data.gameDate),
      new Opponent(data.opponent),
      new Score(data.dragonsScore),
      new Score(data.opponentScore),
      new Stadium(data.stadium),
      data.notes ? new Notes(data.notes) : undefined,
      data.createdAt,
      data.updatedAt,
    );
  }
}
