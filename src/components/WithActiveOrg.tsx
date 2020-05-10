import React from "react";
import { useLocation } from "react-router";
import { Subtract } from "utility-types"

export interface IWithActiveOrgProps {
  orgId: string | null,
  projectId: string | null,
}

export const withActiveOrg = <T extends IWithActiveOrgProps>(Component: React.ComponentType<T>) => {
  const X: React.FunctionComponent<Subtract<T, IWithActiveOrgProps>> = (props: Subtract<T, IWithActiveOrgProps>) => {
    const params =  new URLSearchParams(useLocation().search);
    const orgParam = params.get('org');
    const projectParam = params.get('project');
    return (<Component orgId={orgParam} projectId={projectParam} {...props as T} />);
  };
  return X;
};
