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
  myPlayer$ = this.sls.myPlayer$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;

  private destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private sls: StadtlandService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('gameId')),
        takeUntil(this.destroy$)
      )
      .subscribe((gameId) => this.sls.setCurrentGame(gameId));

    this.state$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      const redirectPath = this.sls.getRouteForGameState(state);
      if (redirectPath) {
        this.router.navigate([redirectPath], { relativeTo: this.route });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
