import { Component } from '@angular/core';
import { timer } from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
  mapTo,
  startWith,
} from 'rxjs/operators';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-player-avatar-meta',
  templateUrl: './player-avatar-meta.component.html',
  styleUrls: ['./player-avatar-meta.component.scss'],
})
export class PlayerAvatarMetaComponent {
  myPlayer$ = this.sls.myPlayer$;
  gameCreatedByMe$ = this.sls.gameCreatedByMe$;

  scoreChanged$ = this.myPlayer$.pipe(
    filter(e => !!e),
    map(p => p.score),
    distinctUntilChanged(),
    exhaustMap(() => timer(400).pipe(delay(300), mapTo(false), startWith(true)))
  );

  constructor(private sls: StadtlandService) {}
}
