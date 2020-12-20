import { Component, OnInit } from '@angular/core';
import { concatMap, map } from 'rxjs/operators';
import { GameState } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-landing',
  templateUrl: './game-landing.component.html',
  styleUrls: ['./game-landing.component.scss'],
})
export class GameLandingComponent implements OnInit {
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;
  gameStarted$ = this.sls.gameStarted$;

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {}

  startGame() {
    this.sls.setGameState(GameState.StartedIdle).subscribe();
  }

  newRound() {
    this.sls
      .createNewRoundWithRandomLetter()
      .pipe(concatMap(() => this.sls.setGameState(GameState.RoundDicing)))
      .subscribe();
  }
}
