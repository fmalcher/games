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
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {}

  finishRound() {
    this.sls
      .moveRoundPointsToPlayerScore()
      .pipe(concatMap(() => this.sls.setGameState(GameState.StartedIdle)))
      .subscribe();
  }

  setPoints(answerId: string, position: number, points: number) {
    this.sls.setRoundPoints(answerId, position, points).subscribe();
  }

  getPointClasses(points: number) {
    return {
      points0: points === 0,
      points5: points === 5,
      points10: points === 10,
      points20: points === 20,
    };
  }
}
