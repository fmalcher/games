import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent {
  constructor(
    private sls: StadtlandService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  createNewGame(): void {
    this.sls.createNewGame().subscribe(id => {
      this.router.navigate([id, 'landing'], { relativeTo: this.route });
    });
  }
}
