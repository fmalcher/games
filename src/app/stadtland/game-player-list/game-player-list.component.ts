import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { GameState } from '../shared/models';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-player-list',
  templateUrl: './game-player-list.component.html',
  styleUrls: ['./game-player-list.component.scss'],
})
export class GamePlayerListComponent implements OnInit {
  gameCreated$ = this.sls.gameCreated$;
  players$ = this.sls.players$;
  myPlayer$ = this.sls.myPlayer$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {}

  removePlayer(id: string): void {
    if (window.confirm('Der Spieler wird aus dem Spiel entfernt. Fortfahren?')) {
      this.sls.removePlayer(id).subscribe();
    }
  }
}
