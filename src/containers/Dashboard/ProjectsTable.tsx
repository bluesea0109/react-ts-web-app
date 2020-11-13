import { useMutation } from '@apollo/client';
import { Switch } from '@material-ui/core';

import 'firebase/auth';
import React from 'react';
import { GET_CURRENT_USER, UPDATE_ACTIVE_ORG } from '../../common-gql-queries';
import { IOrg, IProject } from '../../models/user-service';
import ApolloErrorPage from '../ApolloErrorPage';
import ContentLoading from '../ContentLoading';
import { CommonTable } from '../../components';

interface IProjectsTableProps {
  activeOrg: IOrg;
  activeProject?: IProject | null;
}

function ProjectsTable({ activeOrg, activeProject }: IProjectsTableProps) {
  const [updateActiveOrg, { loading, error }] = useMutation(UPDATE_ACTIVE_ORG, {
    refetchQueries: [{ query: GET_CURRENT_USER }],
    awaitRefetchQueries: false,
  });

  const setActiveProject = async (orgId: string, projectId: string) => {
    updateActiveOrg({
      variables: {
        orgId,
        projectId,
      },
    });
  };

  if (loading) {
    return <ContentLoading shrinked={true} />;
  }

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  const projects = activeOrg.projects;
  const activeProjectId = activeProject?.id;

  const activateProject = (projectId: string) => {
    setActiveProject(activeOrg.id, projectId);
  };

  const columns = [
    { title: 'Project Name', field: 'name' },
    { title: 'Project ID', field: 'id' },
    {
      title: 'Activate',
      renderRow: (project: IProject) =>
        activeProjectId !== project.id ? (
          <Switch
            color="primary"
            checked={false}
            onChange={(event) => activateProject(project.id)}
          />
        ) : (
          <Switch color="primary" checked={true} />
        ),
    },
  ];

  return (
    <CommonTable
      data={{
        columns,
        rowsData: projects,
      }}
    />
  );
}

export default ProjectsTable;
