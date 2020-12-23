import { Component, OnInit } from '@angular/core';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-player-list',
  templateUrl: './game-player-list.component.html',
  styleUrls: ['./game-player-list.component.scss'],
})
export class GamePlayerListComponent implements OnInit {
  gameStarted$ = this.sls.gameStarted$;
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
