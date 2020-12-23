import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { distinctUntilChanged, exhaustMap, map, mapTo, startWith } from 'rxjs/operators';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-player-avatar-meta',
  templateUrl: './player-avatar-meta.component.html',
  styleUrls: ['./player-avatar-meta.component.scss'],
})
export class PlayerAvatarMetaComponent implements OnInit {
  myPlayer$ = this.sls.myPlayer$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;

  scoreChanged$ = this.myPlayer$.pipe(
    map(p => p.score),
    distinctUntilChanged(),
    exhaustMap(() => timer(400).pipe(mapTo(false), startWith(true)))
  );

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {}
}
