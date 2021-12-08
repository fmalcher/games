import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, of, map } from 'rxjs';

import { StadtlandService } from './stadtland.service';

@Injectable({
  providedIn: 'root',
})
export class StateRedirectGuard implements CanActivate {
  constructor(private sls: StadtlandService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const redirects = route.data.redirectWhenState;
    if (!redirects) {
      return of(true);
    }

    return this.sls.state$.pipe(
      map(state => {
        if (!state) {
          return true;
        }

        const redirect = redirects[state];
        if (!redirect) {
          return true;
        }

        const segments = routerState.url.split('/');
        segments.pop();
        return this.router.createUrlTree([...segments, redirect]);
      })
    );
  }
}
