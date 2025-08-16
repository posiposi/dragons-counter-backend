import { Module } from '@nestjs/common';
import { CreateGameController } from './controllers/create-game.controller';
import { GetGamesController } from './controllers/get-games.controller';
import { CreateGameUseCase } from '../domain/usecases/create-game.usecase';
import { GetGamesUsecase } from '../domain/usecases/get-games.usecase';
import { GameAdapter } from '../infrastructure/adapters/game.adapter';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [CreateGameController, GetGamesController],
  providers: [
    CreateGameUseCase,
    GetGamesUsecase,
    {
      provide: 'GamePort',
      useClass: GameAdapter,
    },
    PrismaService,
    {
      provide: PrismaClient,
      useExisting: PrismaService,
    },
  ],
})
export class GameModule {}
