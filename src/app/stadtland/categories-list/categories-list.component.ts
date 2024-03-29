import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesListComponent {
  @Input() categories: string[] = [];
}
