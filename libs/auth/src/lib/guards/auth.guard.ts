import { Injectable, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, tap } from 'rxjs';

// @Injectable()
@Injectable({ providedIn: 'root'})
class UserToken {}

@Injectable({ providedIn: 'root'})
class PermissionsService {
  constructor(private authService: AuthService) {}

  canActivate(currentToken: UserToken): Observable<boolean> {
    return this.authService.isLoggedIn$;
  }
  canMatch(currentUser: UserToken): boolean {
    return true;
  }
  // canActivate(currentUser: UserToken, userId: string): boolean {
  //   return true;
  // }
  // canMatch(currentUser: UserToken): boolean {
  //   return true;
  // }
}

export const authGuard: CanActivateFn = (route, state) => {
  return inject(PermissionsService)
    .canActivate(inject(UserToken))
    .pipe(tap((x) => console.log('[authGuard]', x)));
};
