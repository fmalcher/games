import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject, timer } from 'rxjs';
import {
  debounceTime,
  exhaustMap,
  filter,
  map,
  mapTo,
  shareReplay,
  startWith,
  switchMap,
  take,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import { slfConfig } from '../shared/config';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  private randomCatDiceRoll$ = new Subject<number>();

  categoriesFromGame$ = this.sls.categories$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;
  form = new FormGroup(
    {
      categories: new FormArray([]),
    },
    { updateOn: 'blur' }
  );

  saveMessage$: Observable<boolean>;

  categoriesListTagged$ = this.form.valueChanges.pipe(
    map(value => value.categories),
    startWith(this.categoriesFormArray.value),
    filter(e => !!e),
    map((formValues: string[]) =>
      slfConfig.categories.map(value => {
        const added = formValues.includes(value);
        return { value, added };
      })
    ),
    shareReplay(1)
  );

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {
    this.categoriesListTagged$.subscribe(); // first trigger

    // write values from game to the form
    this.categoriesFromGame$
      .pipe(
        filter(
          gameCats =>
            !this.categoryListsEqual(
              gameCats,
              this.categoriesFormArray.value.filter(e => !!e)
            )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(categories => this.replaceCategoryFields(categories));

    this.saveMessage$ = this.form.valueChanges.pipe(
      debounceTime(500),
      map(value => value.categories.filter(e => !!e)),
      withLatestFrom(this.categoriesFromGame$),
      filter(([formCats, gameCats]) => !this.categoryListsEqual(formCats, gameCats)),
      switchMap(([categories]) => this.sls.setCategories(categories)),
      switchMap(() => timer(1000).pipe(mapTo(false), startWith(true)))
    );

    this.randomCatDiceRoll$
      .pipe(
        exhaustMap(n => timer(0, 150).pipe(take(6), mapTo(n))),
        takeUntil(this.destroy$)
      )
      .subscribe(n => this.setRandomCategories(n));
  }

  private replaceCategoryFields(categories: string[]) {
    this.form.setControl('categories', new FormArray(categories.map(c => new FormControl(c))));
  }

  get categoriesFormArray(): FormArray {
    return this.form.get('categories') as FormArray;
  }

  addField(value?: string): void {
    this.categoriesFormArray.push(new FormControl(value || ''));
  }

  removeField(index: number) {
    this.categoriesFormArray.removeAt(index);
  }

  removeFieldByValue(value: string) {
    const index = (this.categoriesFormArray.value as string[]).findIndex(e => e === value);
    if (index >= 0) {
      this.removeField(index);
    }
  }

  removeAll() {
    this.replaceCategoryFields([]);
  }

  addAllCategories() {
    this.replaceCategoryFields(slfConfig.categories);
  }

  setRandomCategories(n: number) {
    const num = Math.max(Math.min(n, slfConfig.categories.length), 1);
    const categories = this.sls.getRandomElementsFromArray(slfConfig.categories, num);
    this.replaceCategoryFields(categories);
  }

  setRandomCategoriesDiceRoll(n: number) {
    this.randomCatDiceRoll$.next(n);
  }

  getCategoryValuesFiltered() {
    return this.categoriesFormArray.value.filter(e => !!e);
  }

  private categoryListsEqual(a: string[], b: string[]) {
    return JSON.stringify(a) == JSON.stringify(b);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
