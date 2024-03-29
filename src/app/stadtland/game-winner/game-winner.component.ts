import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-winner',
  templateUrl: './game-winner.component.html',
  styleUrls: ['./game-winner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameWinnerComponent {
  firstPlayer$ = this.sls.players$.pipe(map(players => players?.[0]));
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;

  constructor(
    private sls: StadtlandService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  createNewGame(): void {
    if (!window.confirm('Neues Spiel starten?')) {
      return;
    }
    this.sls.createNewGame().subscribe(id => {
      this.router.navigate(['../..', id, 'landing'], { relativeTo: this.route });
    });
  }
}
