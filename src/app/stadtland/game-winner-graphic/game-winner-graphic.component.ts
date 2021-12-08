import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-winner-graphic',
  templateUrl: './game-winner-graphic.component.svg',
  styleUrls: ['./game-winner-graphic.component.scss'],
})
export class GameWinnerGraphicComponent {
  @Input() name?: string;
  @Input() emoji?: string;
}
