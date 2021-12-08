import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  fromEvent,
  Subject,
  delay,
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';

import { slfConfig } from '../shared/config';
import { GameState } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-round-write',
  templateUrl: './game-round-write.component.html',
  styleUrls: ['./game-round-write.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameRoundWriteComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  form: FormGroup;
  categories$ = this.sls.currentRoundCategories$;
  letter$ = this.sls.currentRoundLetter$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;

  /** signal for state transition to "givingpoints". this happens when someone hits "STOP" */
  stopped$ = this.sls.state$.pipe(
    map(state => state === GameState.RoundGivingPoints),
    distinctUntilChanged(),
    shareReplay(1)
  );

  countDown$ = this.stopped$.pipe(
    filter(e => e),
    exhaustMap(() => this.sls.generateCountdown(slfConfig.roundEndCountdownSeconds)),
    map(value => ({ value }))
  );

  constructor(
    private sls: StadtlandService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup({
      answers: new FormArray([]),
    });

    // create form fields from categories
    this.categories$.pipe(take(1)).subscribe(categories => {
      this.form.setControl(
        'answers',
        new FormArray(categories.map(() => new FormControl('', Validators.required)))
      );
    });

    // when stopped, start timeout
    // after this: save my answers and and navigate to points view
    this.stopped$
      .pipe(
        filter(e => e),
        delay(slfConfig.roundEndCountdownSeconds * 1000),
        switchMap(() => {
          const answers = this.form.get('answers')!.value as string[];
          return this.sls.submitMyAnswers(answers);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.router.navigate(['..', 'points'], { relativeTo: this.route });
      });

    fromEvent<BeforeUnloadEvent>(window, 'beforeunload')
      .pipe(takeUntil(this.destroy$))
      .subscribe(e => {
        e.preventDefault();
        e.returnValue = '';
      });
  }

  stop() {
    this.sls.stopCurrentRound().subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
