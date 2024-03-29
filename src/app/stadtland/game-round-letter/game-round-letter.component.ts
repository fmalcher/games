import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  combineLatest,
  of,
  timer,
  delayWhen,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs';

import { slfConfig } from '../shared/config';
import { GameState } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-round-letter',
  templateUrl: './game-round-letter.component.html',
  styleUrls: ['./game-round-letter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameRoundLetterComponent {
  currentRound$ = this.sls.currentRound$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;

  roundRenewedByMe = false;

  // long-running stream of rolls for display
  diceRoll$ = this.currentRound$.pipe(
    filter(round => !!(round && round.letter)),
    switchMap(round => this.sls.generateTimedDiceRoll(round.letter))
  );

  letter$ = this.diceRoll$.pipe(map(roll => roll.letter));

  // indicates whether the roll shows the final letter
  rollIsFinal$ = this.diceRoll$.pipe(
    map(roll => roll.final),
    distinctUntilChanged()
  );

  renewDisabled$ = combineLatest([
    this.gameCreatedByMe$,
    this.rollIsFinal$.pipe(
      delayWhen(final =>
        // after roll became final, wait before activating renewal again
        final ? timer(slfConfig.roundRenewTimeout * 1000) : of(null)
      )
    ),
  ]).pipe(
    map(([createdByMe, final]) => !final || (!createdByMe && this.roundRenewedByMe)),
    distinctUntilChanged()
  );

  constructor(private sls: StadtlandService) {}

  renew() {
    this.sls.renewCurrentRound().subscribe();
    this.roundRenewedByMe = true;
  }

  start() {
    this.sls.setGameState(GameState.RoundWriting).subscribe();
  }

  cancel() {
    if (window.confirm('Möchtest Du die Runde wirklich abbrechen?')) {
      this.sls.setGameState(GameState.StartedIdle).subscribe();
    }
  }
}
