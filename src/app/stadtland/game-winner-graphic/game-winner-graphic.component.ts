import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-winner-graphic',
  templateUrl: './game-winner-graphic.component.svg',
  styleUrls: ['./game-winner-graphic.component.scss'],
})
export class GameWinnerGraphicComponent implements OnInit {
  @Input() name: string;
  @Input() emoji: string;

  constructor() {}

  ngOnInit(): void {}
}
