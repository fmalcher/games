import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';

import { GameRoundWriteComponent } from '../game-round-write/game-round-write.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmLeaveWriteGuard implements CanDeactivate<GameRoundWriteComponent> {
  canDeactivate(
    component: GameRoundWriteComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> {
    return component.stopped$.pipe(
      take(1),
      map(stopped => stopped || window.confirm('Möchtest Du die Seite wirklich verlassen?'))
    );
  }
}
