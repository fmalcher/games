import { Component } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-player-list',
  templateUrl: './game-player-list.component.html',
  styleUrls: ['./game-player-list.component.scss'],
})
export class GamePlayerListComponent {
  gameCreated$ = this.sls.gameCreated$;
  players$ = this.sls.players$;
  myPlayer$ = this.sls.myPlayer$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;

  // (p.isMe || (gameCreatedByMe$ | async)) && gameCreated$ | async

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
