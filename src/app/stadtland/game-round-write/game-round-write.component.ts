import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, of, range, Subject, timer, zip } from 'rxjs';
import {
  delay,
  exhaustMap,
  filter,
  map,
  pairwise,
  share,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';
import { GameState } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-round-write',
  templateUrl: './game-round-write.component.html',
  styleUrls: ['./game-round-write.component.scss'],
})
export class GameRoundWriteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  private countdownSeconds = 5;

  categories$ = this.sls.currentRoundCategories$;
  form: FormGroup;
  letter$ = this.sls.currentRound$.pipe(map((round) => round.letter));

  stopped$ = this.sls.state$.pipe(
    pairwise(),
    filter(
      ([a, b]) =>
        a === GameState.RoundWriting && b === GameState.RoundGivingPoints
    ),
    share()
  );

  countDown$ = this.stopped$.pipe(
    exhaustMap(() => this.sls.generateCountdown(this.countdownSeconds)),
    map((value) => ({ value }))
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

    this.categories$.pipe(take(1)).subscribe((categories) => {
      this.form.setControl(
        'answers',
        new FormArray(
          categories.map(() => new FormControl('', Validators.required))
        )
      );
    });

    this.stopped$
      .pipe(
        delay(this.countdownSeconds * 1000),
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
    this.sls.setGameState(GameState.RoundGivingPoints).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
