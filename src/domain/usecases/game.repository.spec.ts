import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { GameRepository } from './game.repository';
import { Game } from '../entities/game';
import { GameId } from '../value-objects/game-id';
import { Score } from '../value-objects/score';
import { Opponent } from '../value-objects/opponent';
import { Stadium } from '../value-objects/stadium';
import { Notes } from '../value-objects/notes';
import { GameDate } from '../value-objects/game-date';
import { GameResultValue } from '../value-objects/game-result';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

describe('GameRepository Integration Tests', () => {
  let prismaService: PrismaService;
  let module: TestingModule;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        GameRepository,
        PrismaService,
        {
          provide: PrismaClient,
          useExisting: PrismaService,
        },
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    prismaClient = prismaService;

    await prismaService.game.deleteMany();
  });

  afterAll(async () => {
    await prismaService.game.deleteMany();
    await prismaService.$disconnect();
    await module.close();
  });

  describe('save', () => {
    const testCases = [
      {
        description: 'should save a game with WIN result and notes',
        gameData: {
          date: new Date('2024-04-01'),
          opponent: '横浜DeNAベイスターズ',
          stadium: 'バンテリンドーム',
          dragonsScore: 5,
          opponentScore: 3,
          notes: '開幕戦で勝利！',
        },
        expectedResult: GameResultValue.WIN,
      },
      {
        description: 'should save a game with LOSE result',
        gameData: {
          date: new Date('2024-04-02'),
          opponent: '阪神タイガース',
          stadium: '甲子園',
          dragonsScore: 2,
          opponentScore: 7,
          notes: '大敗',
        },
        expectedResult: GameResultValue.LOSE,
      },
      {
        description: 'should save a game with DRAW result',
        gameData: {
          date: new Date('2024-04-03'),
          opponent: '広島東洋カープ',
          stadium: 'マツダスタジアム',
          dragonsScore: 4,
          opponentScore: 4,
          notes: '引き分け',
        },
        expectedResult: GameResultValue.DRAW,
      },
    ];

    test.each(testCases)(
      '$description',
      async ({ gameData, expectedResult }) => {
        try {
          await prismaClient.$transaction(
            async (tx) => {
              const gameId = new GameId(randomUUID());
              const game = new Game(
                gameId,
                new GameDate(gameData.date),
                new Opponent(gameData.opponent),
                new Score(gameData.dragonsScore),
                new Score(gameData.opponentScore),
                new Stadium(gameData.stadium),
                new Notes(gameData.notes),
                gameData.date,
                gameData.date,
              );

              const repository = new GameRepository(tx as PrismaClient);
              const result = await repository.save(game);

              expect(result).toBeInstanceOf(Game);
              expect(result.id.value).toBe(gameId.value);
              expect(result.gameDate.value).toEqual(gameData.date);
              expect(result.opponent.value).toBe(gameData.opponent);
              expect(result.stadium.value).toBe(gameData.stadium);
              expect(result.dragonsScore.value).toBe(gameData.dragonsScore);
              expect(result.opponentScore.value).toBe(gameData.opponentScore);
              expect(result.result.value).toBe(expectedResult);

              if (gameData.notes) {
                expect(result.notes?.value).toBe(gameData.notes);
              } else {
                expect(result.notes).toBeUndefined();
              }

              const savedGame = await tx.game.findUnique({
                where: { id: gameId.value },
              });

              expect(savedGame).not.toBeNull();
              expect(savedGame?.id).toBe(gameId.value);
              expect(savedGame?.gameDate).toEqual(gameData.date);
              expect(savedGame?.opponent).toBe(gameData.opponent);
              expect(savedGame?.stadium).toBe(gameData.stadium);
              expect(savedGame?.dragonsScore).toBe(gameData.dragonsScore);
              expect(savedGame?.opponentScore).toBe(gameData.opponentScore);
              expect(savedGame?.result).toBe(expectedResult);
              expect(savedGame?.notes).toBe(gameData.notes || null);

              throw new Error('Rollback transaction');
            },
            {
              maxWait: 5000,
              timeout: 10000,
            },
          );
        } catch (error: unknown) {
          expect((error as Error).message).toBe('Rollback transaction');
        }
      },
    );
  });
});
