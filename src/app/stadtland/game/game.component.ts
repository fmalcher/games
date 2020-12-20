import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, map, takeUntil, tap } from 'rxjs/operators';
import { GameState } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  state$ = this.sls.state$;
  game$ = this.sls.game$;
  myScore$ = this.sls.myScore$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;
  currentRound$ = this.sls.currentRound$;

  private destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private sls: StadtlandService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(map((params) => params.get('gameId')))
      .subscribe((gameId) => this.sls.setCurrentGame(gameId));

    this.state$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      switch (state) {
        case GameState.StartedIdle:
          this.router.navigate(['landing'], { relativeTo: this.route });
          break;
        case GameState.RoundDicing:
          this.router.navigate(['dice'], { relativeTo: this.route });
          break;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
