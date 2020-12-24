import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-winner',
  templateUrl: './game-winner.component.html',
  styleUrls: ['./game-winner.component.scss'],
})
export class GameWinnerComponent implements OnInit {
  firstPlayer$ = this.sls.players$.pipe(map(players => players?.[0]));

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {}
}
