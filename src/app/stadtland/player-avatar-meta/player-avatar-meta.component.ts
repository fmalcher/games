import { Component, OnInit } from '@angular/core';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-player-avatar-meta',
  templateUrl: './player-avatar-meta.component.html',
  styleUrls: ['./player-avatar-meta.component.scss'],
})
export class PlayerAvatarMetaComponent implements OnInit {
  myPlayer$ = this.sls.myPlayer$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {}
}
