import { Test, TestingModule } from '@nestjs/testing';
import { GetGamesController } from './get-games.controller';
import { GetGamesUsecase } from '../../domain/usecases/get-games.usecase';
import { Game } from '../../domain/entities/game';
import { GameId } from '../../domain/value-objects/game-id';
import { GameDate } from '../../domain/value-objects/game-date';
import { Opponent } from '../../domain/value-objects/opponent';
import { Score } from '../../domain/value-objects/score';
import { Stadium } from '../../domain/value-objects/stadium';
import { Notes } from '../../domain/value-objects/notes';

describe('GetGamesController', () => {
  let controller: GetGamesController;
  let usecase: GetGamesUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetGamesController],
      providers: [
        {
          provide: GetGamesUsecase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetGamesController>(GetGamesController);
    usecase = module.get<GetGamesUsecase>(GetGamesUsecase);
  });

  describe('getGames', () => {
    it('should return all games', async () => {
      const mockGames: Game[] = [
        new Game(
          new GameId('game-1'),
          new GameDate(new Date('2024-06-01')),
          new Opponent('巨人'),
          new Score(5),
          new Score(3),
          new Stadium('バンテリンドーム'),
          new Notes('逆転勝利！'),
          new Date('2024-06-01T10:00:00Z'),
          new Date('2024-06-01T10:00:00Z'),
        ),
        new Game(
          new GameId('game-2'),
          new GameDate(new Date('2024-06-02')),
          new Opponent('阪神'),
          new Score(2),
          new Score(4),
          new Stadium('甲子園'),
          new Notes('接戦でした'),
          new Date('2024-06-02T10:00:00Z'),
          new Date('2024-06-02T10:00:00Z'),
        ),
      ];

      const executeSpy = jest
        .spyOn(usecase, 'execute')
        .mockResolvedValue(mockGames);

      const result = await controller.getGames();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'game-1',
        gameDate: '2024-06-01',
        opponent: '巨人',
        dragonsScore: 5,
        opponentScore: 3,
        result: 'win',
        stadium: 'バンテリンドーム',
        notes: '逆転勝利！',
        createdAt: '2024-06-01T10:00:00.000Z',
        updatedAt: '2024-06-01T10:00:00.000Z',
      });
      expect(result[1]).toEqual({
        id: 'game-2',
        gameDate: '2024-06-02',
        opponent: '阪神',
        dragonsScore: 2,
        opponentScore: 4,
        result: 'lose',
        stadium: '甲子園',
        notes: '接戦でした',
        createdAt: '2024-06-02T10:00:00.000Z',
        updatedAt: '2024-06-02T10:00:00.000Z',
      });
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no games exist', async () => {
      const executeSpy = jest.spyOn(usecase, 'execute').mockResolvedValue([]);

      const result = await controller.getGames();

      expect(result).toEqual([]);
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle null notes correctly', async () => {
      const mockGames: Game[] = [
        new Game(
          new GameId('game-1'),
          new GameDate(new Date('2024-06-01')),
          new Opponent('巨人'),
          new Score(5),
          new Score(3),
          new Stadium('バンテリンドーム'),
          undefined,
          new Date('2024-06-01T10:00:00Z'),
          new Date('2024-06-01T10:00:00Z'),
        ),
      ];

      jest.spyOn(usecase, 'execute').mockResolvedValue(mockGames);

      const result = await controller.getGames();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result[0]?.notes).toBeNull();
    });
  });
});
