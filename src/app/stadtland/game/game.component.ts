import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GameState } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  state$ = this.sls.state$;
  myPlayer$ = this.sls.myPlayer$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private sls: StadtlandService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // when game state changes, redirect accordingly
    this.state$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      const redirectPath = !!state && this.getRedirects(state);
      if (redirectPath) {
        this.router.navigate([redirectPath], { relativeTo: this.route });
      }
    });
  }

  private getRedirects(state: GameState): string | undefined {
    switch (state) {
      case GameState.StartedIdle:
        return 'landing';
      case GameState.RoundDicing:
        return 'dice';
      case GameState.RoundWriting:
        return 'write';
      case GameState.GameFinished:
        return 'winner';
      default:
        return;
      // transition to "points" is done in the writing component
      // case GameState.RoundGivingPoints: return 'points';
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
