import { Controller, Get } from '@nestjs/common';
import { GetGamesUsecase } from '../../domain/usecases/get-games.usecase';

@Controller('games')
export class GetGamesController {
  constructor(private readonly getGamesUsecase: GetGamesUsecase) {}

  @Get()
  async getGames(): Promise<any[]> {
    const games = await this.getGamesUsecase.execute();

    return games.map((game) => ({
      id: game.id.value,
      gameDate: game.gameDate.format(),
      opponent: game.opponent.value,
      dragonsScore: game.dragonsScore.value,
      opponentScore: game.opponentScore.value,
      result: game.result.value.toLowerCase(),
      stadium: game.stadium.value,
      notes: game.notes?.value || null,
      createdAt: game.createdAt.toISOString(),
      updatedAt: game.updatedAt.toISOString(),
    }));
  }
}
