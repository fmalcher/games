import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StadtlandService } from './stadtland.service';

@Injectable({
  providedIn: 'root',
})
export class OnlyCreatedByMeGuard implements CanActivate {
  constructor(private sls: StadtlandService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.sls.gameCreatedByMe$;
  }
}
