import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesListComponent implements OnInit {
  categories$ = this.sls.categories$;

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {}
}
