import { Component, OnInit } from '@angular/core';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements OnInit {
  categories$ = this.sls.categories$;

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {}
}
