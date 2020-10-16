import { useLocation } from 'react-router';

export interface IActiveOrg {
  orgId: string | null;
  projectId: string | null;
}

export const useActiveOrg = (): IActiveOrg => {
  const params = new URLSearchParams(useLocation().search);
  const orgParam = params.get('org');
  const projectParam = params.get('project');
  return {
    orgId: orgParam,
    projectId: projectParam,
  };
};
