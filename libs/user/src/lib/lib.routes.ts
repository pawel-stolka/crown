import { Route } from '@angular/router';
import { UserComponent } from './user/user.component';
// import { Action, ActionReducer, provideState } from '@ngrx/store';
// import { selectUserState } from './user/state/user.selectors';
// import * as fromUser from './user/state/user.reducer';
// import * as fromUser from './user/state/user.selectors';
// import * as fromUser from './user/state/user.reducer';
// import { userReducer } from './user/state/user.reducer';
// import { selectShowNotifications } from './user/state/user.selectors';
// import { selectUserState } from './user/state/user.selectors';

export const userRoutes: Route[] = [
  {
    path: '',
    component: UserComponent,
    // providers: [
    //   // provideState(fromUser.selectUserState, fromUser.userReducer),
    //   provideState(fromUser.selectShowNotifications, fromUser.userReducer),
    //   // provideEffects(UsersEffects),
    // ],
  },
];
