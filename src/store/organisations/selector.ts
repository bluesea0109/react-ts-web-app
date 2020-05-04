
import { createSelector } from 'reselect';
import { AppState } from "..";
const organisations = (state: AppState) => state.organisations;

export const selectOrganisations = createSelector(
  [organisations],
  organisations => organisations.data
)

export const selectOrganisationFetching = createSelector(
  [organisations],
  organisations => organisations.isFetching
)
