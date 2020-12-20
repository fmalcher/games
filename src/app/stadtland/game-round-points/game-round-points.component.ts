import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { GameState } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-round-points',
  templateUrl: './game-round-points.component.html',
  styleUrls: ['./game-round-points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameRoundPointsComponent implements OnInit {
  data$ = this.sls.cumulatedRoundData$;
  players$ = this.sls.players$;

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {}

  finishRound() {
    this.sls
      .moveRoundPointsToPlayerScore()
      .pipe(concatMap(() => this.sls.setGameState(GameState.StartedIdle)))
      .subscribe();
  }

  reduceRowPoints(answers: { points: number }[]): number {
    return answers.reduce((acc, item) => acc + item.points, 0);
  }

  setPoints(answerId: string, position: number, points: number) {
    this.sls.setRoundPoints(answerId, position, points).subscribe();
  }
}
