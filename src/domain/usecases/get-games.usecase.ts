import { Injectable, Inject } from '@nestjs/common';
import type { GamePort } from '../ports/game.port';
import { Game } from '../entities/game';

@Injectable()
export class GetGamesUsecase {
  constructor(@Inject('GamePort') private readonly gamePort: GamePort) {}

  async execute(): Promise<Game[]> {
    return await this.gamePort.findAll();
  }
}
