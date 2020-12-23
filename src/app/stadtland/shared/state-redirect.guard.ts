import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
