import { AppState } from "..";

export const getOrganisations = (store: AppState) => store.organisations.data;
export const getFetchingOrganisations = (store: AppState) => store.organisations.isFetching;
export const getNewOrgLoader = (store: AppState) => store.organisations.loader.newOrg;
