import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  Observable,
  Subject,
  timer,
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
} from 'rxjs';
import { slfConfig } from '../shared/config';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesFormComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private randomCatDiceRoll$ = new Subject<number>();

  categoriesFromGame$ = this.sls.categories$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;
  form = new FormGroup(
    {
      categories: new FormArray([]),
    },
    { updateOn: 'blur' }
  );

  // initial value for the "random categories" field, based on the current number of categories
  randomCategoriesInitialNum$ = this.categoriesFromGame$.pipe(
    take(1),
    filter((e): e is string[] => !!e),
    map(({ length }) => (length > 5 ? length : 5))
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

  constructor(private sls: StadtlandService) {
    this.categoriesListTagged$.subscribe(); // first trigger

    // write values from game to the form
    this.categoriesFromGame$
      .pipe(
        filter(
          gameCats =>
            !this.categoryListsEqual(
              gameCats,
              this.categoriesFormArray.value.filter((e: string) => !!e)
            )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(categories => !!categories && this.replaceCategoryFields(categories));

    this.saveMessage$ = this.form.valueChanges.pipe(
      debounceTime(500),
      map(value => value.categories.filter((e: string) => !!e)),
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

  setRandomCategoriesDiceRoll(n: number | string) {
    const num = Number(n);
    this.randomCatDiceRoll$.next(num);
  }

  getCategoryValuesFiltered() {
    return this.categoriesFormArray.value.filter((e: string) => !!e);
  }

  private categoryListsEqual(a: string[] | undefined, b: string[] | undefined) {
    if (!a || !b) {
      return false;
    }
    return JSON.stringify(a) == JSON.stringify(b);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
