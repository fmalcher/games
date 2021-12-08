import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable, of, map } from 'rxjs';

import { Player } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-player-list',
  templateUrl: './game-player-list.component.html',
  styleUrls: ['./game-player-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePlayerListComponent {
  gameCreated$ = this.sls.gameCreated$;
  players$ = this.sls.players$;
  myPlayer$ = this.sls.myPlayer$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;

  constructor(private sls: StadtlandService) {}

  showRemoveBtnForPlayer(player: Player): Observable<boolean> {
    return combineLatest([of(player.isMe), this.gameCreatedByMe$, this.gameCreated$]).pipe(
      map(([isMe, gameCreatedByMe, gameCreated]) => (isMe || gameCreatedByMe) && gameCreated)
    );
  }

  removePlayer(id: string): void {
    if (window.confirm('Spieler:in wird aus dem Spiel entfernt. Fortfahren?')) {
      this.sls.removePlayer(id).subscribe();
    }
  }
}
