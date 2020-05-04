import { createSelector } from 'reselect';
import { AppState } from ".";
const auth = (state: AppState) => state.auth;

export const selectAuth = createSelector(
  [auth],
  auth => auth
)

export const selectCurrentUser = createSelector(
  [auth],
  auth => auth.user
)

export const selectActiveOrg = createSelector(
  [auth],
  auth => auth.activeOrg
)
