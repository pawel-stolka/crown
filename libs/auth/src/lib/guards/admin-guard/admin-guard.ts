import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ToastService } from '@crown/shared';
import { AuthService } from 'libs/shared/src/lib/services/auth/auth.service';
import { Observable, map, of, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild {
  private toast = inject(ToastService);
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    this.toast.showWarning(
      'Brak uprawnień',
      'Zaloguj się na konto administratora'
    );
    return of(false);
    // return this.authService.isAdmin$.pipe(
    //   take(1),
    //   map((x) => !!x),
    //   map((isAdmin) => {
    //     console.log('[isAdmin]', isAdmin);

    //     if (!isAdmin) {
    //       // this.router.navigate(['/not-authorized']);
    //       alert('show not-authorized message at top');
    //       this.router.navigate(['/']);
    //       return false;
    //     }
    //     return true;
    //   })
    // );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return of(true);
  }
}
