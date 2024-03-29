import { ChangeDetectionStrategy, Component } from '@angular/core';
import { concatMap, filter, map } from 'rxjs';

import { GameState } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-landing',
  templateUrl: './game-landing.component.html',
  styleUrls: ['./game-landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameLandingComponent {
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;
  gameStarted$ = this.sls.gameStarted$;
  gameCreated$ = this.sls.gameCreated$;
  myPlayer$ = this.sls.myPlayer$;
  categories$ = this.sls.categories$;
  players$ = this.sls.players$;

  pathToRunningRound$ = this.sls.state$.pipe(
    map(state => {
      switch (state) {
        case GameState.RoundDicing:
          return 'dice';
        case GameState.RoundWriting:
          return 'write';
        case GameState.RoundGivingPoints:
          return 'points';
        default:
          return;
      }
    }),
    filter(e => !!e)
  );

  constructor(private sls: StadtlandService) {}

  startGame() {
    if (
      window.confirm('Spiel starten? Danach können die Spieler:innen nicht mehr gelöscht werden.')
    ) {
      this.sls.setGameState(GameState.StartedIdle).subscribe();
    }
  }

  newRound() {
    this.sls
      .createNewRoundWithRandomLetter()
      .pipe(concatMap(() => this.sls.setGameState(GameState.RoundDicing)))
      .subscribe();
  }

  finishGame() {
    if (window.confirm('Soll das Spiel beendet werden?')) {
      this.sls.setGameState(GameState.GameFinished).subscribe();
    }
  }
}
