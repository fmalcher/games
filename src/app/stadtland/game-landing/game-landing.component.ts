import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
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
    this.sls.setGameState(GameState.StartedIdle);
  }

  newRound() {
    this.sls.createNewRoundWithRandomLetter().subscribe(() => {
      this.sls.setGameState(GameState.RoundDicing);
    });
  }
}
