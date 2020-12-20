import { Component, OnInit } from '@angular/core';
import { filter, map, switchMap } from 'rxjs/operators';
import { GameState } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-round-letter',
  templateUrl: './game-round-letter.component.html',
  styleUrls: ['./game-round-letter.component.scss'],
})
export class GameRoundLetterComponent implements OnInit {
  currentRound$ = this.sls.currentRound$;

  letterRoll$ = this.currentRound$.pipe(
    map((round) => round?.letter),
    filter((e) => !!e),
    switchMap((letter) => this.sls.generateTimedDiceRoll(letter))
  );

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {}

  renew() {
    this.sls.renewCurrentRound().subscribe();
  }

  start() {}

  cancel() {
    this.sls.setGameState(GameState.StartedIdle);
  }
}
