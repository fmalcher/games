import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { GameState } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-round-letter',
  templateUrl: './game-round-letter.component.html',
  styleUrls: ['./game-round-letter.component.scss'],
})
export class GameRoundLetterComponent implements OnInit {
  currentRound$ = this.sls.currentRound$;

  diceRoll$ = this.currentRound$.pipe(
    filter((round) => !!(round && round.letter)),
    switchMap((round) => this.sls.generateTimedDiceRoll(round.letter))
  );

  letter$ = this.diceRoll$.pipe(map((roll) => roll.letter));

  rollIsFinal$ = this.diceRoll$.pipe(
    map((roll) => roll.final),
    distinctUntilChanged()
  );

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {}

  renew() {
    this.sls.renewCurrentRound().subscribe();
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
