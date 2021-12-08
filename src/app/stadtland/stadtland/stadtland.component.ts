import { Component } from '@angular/core';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-stadtland',
  templateUrl: './stadtland.component.html',
  styleUrls: ['./stadtland.component.scss'],
})
export class StadtlandComponent {
  state$ = this.sls.state$;

  constructor(private sls: StadtlandService) {}
}
