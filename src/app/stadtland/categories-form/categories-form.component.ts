import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Observable, Subject, timer } from 'rxjs';
import {
  filter,
  map,
  shareReplay,
  startWith,
  take,
  takeUntil,
  tap,
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

  categoriesFromGame$ = this.sls.categories$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;
  form = new FormGroup(
    {
      categories: new FormArray([]),
    },
    { updateOn: 'blur' }
  );

  categoriesListTagged$ = this.form.valueChanges.pipe(
    tap((e) => console.log(e)),
    map((value) => value.categories),
    startWith(this.categoriesFormArray.value),
    filter((e) => !!e),
    map((formValues: string[]) =>
      slfConfig.categories.map((value) => {
        const added = formValues.includes(value);
        return { value, added };
      })
    ),
    shareReplay(1)
  );

  constructor(
    private sls: StadtlandService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoriesListTagged$.subscribe(); // first trigger

    // write values from game to the form
    this.categoriesFromGame$
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) => this.replaceCategoryFields(categories));
  }

  private replaceCategoryFields(categories: string[]) {
    this.form.setControl(
      'categories',
      new FormArray(categories.map((c) => new FormControl(c)))
    );
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
    const index = (this.categoriesFormArray.value as string[]).findIndex(
      (e) => e === value
    );
    if (index >= 0) {
      this.removeField(index);
    }
  }

  setRandomCategories(n = 5) {
    const categories = this.sls.getRandomElementsFromArray(
      slfConfig.categories,
      n
    );
    this.replaceCategoryFields(categories);
  }

  setRandomCategoriesDiceRoll() {
    timer(0, 150)
      .pipe(take(6), takeUntil(this.destroy$))
      .subscribe(() => this.setRandomCategories());
  }

  getCategoryValuesFiltered() {
    return this.categoriesFormArray.value.filter((e) => !!e);
  }

  save(): void {
    this.sls.setCategories(this.getCategoryValuesFiltered()).subscribe(() => {
      this.router.navigate(['../landing'], { relativeTo: this.route });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
