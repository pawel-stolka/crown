import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as UserActions from './user.actions';

export interface UserState {
  showNotifications: boolean;
}

export const initialUserState: UserState = {
  showNotifications: false,
};

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.toggleNotifications, (state) => ({
    ...state,
    showNotifications: !state.showNotifications,
  }))
);

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectShowNotifications = createSelector(
  selectUserState,
  (state: UserState) => state.showNotifications
);
