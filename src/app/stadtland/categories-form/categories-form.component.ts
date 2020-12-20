import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss'],
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  categories$ = this.sls.categories$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;
  form: FormGroup;

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      categories: new FormArray([]),
    });

    this.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) =>
        this.form.setControl(
          'categories',
          new FormArray(categories.map((c) => new FormControl(c)))
        )
      );
  }

  get categoriesArray(): FormArray {
    return this.form.get('categories') as FormArray;
  }

  addField(): void {
    this.categoriesArray.push(new FormControl());
  }

  removeField(index: number) {
    this.categoriesArray.removeAt(index);
  }

  save(): void {
    const categories = this.categoriesArray.value.filter((e) => !!e);
    this.sls.setCategories(categories);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
