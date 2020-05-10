import React from "react";
import { Typography } from "@material-ui/core";
import { useLocation } from "react-router";
import { Subtract } from "utility-types"

interface WithActiveOrgProps {
  orgId: string,
  projectId: string | null,
}

export const withActiveOrg = <T extends WithActiveOrgProps>(Component: React.ComponentType<T>) => {
  const X: React.FunctionComponent<Subtract<T, WithActiveOrgProps>> = (props: Subtract<T, WithActiveOrgProps>) => {
    const params =  new URLSearchParams(useLocation().search);
    const orgParam = params.get('org');
    const projectParam = params.get('project');
    
    if (!orgParam) {
      return <Typography>{"Error: User active org id is not set."}</Typography>
    }
    return (<Component orgId={orgParam} projectId={projectParam} {...props as T} />);
  };
  return X;
};
