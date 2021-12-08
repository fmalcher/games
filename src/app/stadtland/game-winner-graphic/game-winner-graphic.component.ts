import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-winner-graphic',
  templateUrl: './game-winner-graphic.component.svg',
  styleUrls: ['./game-winner-graphic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameWinnerGraphicComponent {
  @Input() name?: string;
  @Input() emoji?: string;
}
