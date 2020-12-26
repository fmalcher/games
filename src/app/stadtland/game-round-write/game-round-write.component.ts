import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, interval, of, range, Subject, timer, zip } from 'rxjs';
import {
  delay,
  exhaustMap,
  filter,
  map,
  pairwise,
  share,
  startWith,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';
import { slfConfig } from '../shared/config';
import { GameState } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-round-write',
  templateUrl: './game-round-write.component.html',
  styleUrls: ['./game-round-write.component.scss'],
})
export class GameRoundWriteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  form: FormGroup;
  categories$ = this.sls.currentRoundCategories$;
  letter$ = this.sls.currentRoundLetter$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;

  /** signal for state transition from "writing" to "givingspoints". this happens when someone hits "STOP" */
  stopped$ = this.sls.state$.pipe(
    pairwise(),
    filter(([a, b]) => a === GameState.RoundWriting && b === GameState.RoundGivingPoints),
    share()
  );

  countDown$ = this.stopped$.pipe(
    exhaustMap(() => this.sls.generateCountdown(slfConfig.roundEndCountdownSeconds)),
    map(value => ({ value }))
  );

  constructor(
    private sls: StadtlandService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
        delay(slfConfig.roundEndCountdownSeconds * 1000),
        switchMap(() => {
          const answers = this.form.get('answers').value as string[];
          return this.sls.submitMyAnswers(answers);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.router.navigate(['..', 'points'], { relativeTo: this.route });
      });
  }

  stop() {
    this.sls.stopCurrentRound().subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
