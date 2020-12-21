import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { StadtlandService } from './stadtland.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentGameGuard implements CanActivate {
  constructor(private sls: StadtlandService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const params = this.collectParams(route);
    this.sls.setCurrentGame(params.gameId);
    return true;
  }

  private collectParams(route: ActivatedRouteSnapshot): any {
    let params = {};
    let r = route;
    while (r.parent) {
      params = { ...params, ...r.params };
      r = r.parent;
    }
    return params;
  }
}
