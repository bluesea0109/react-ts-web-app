import { useMutation } from '@apollo/client';
import {
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import 'firebase/auth';
import React from 'react';
import { GET_CURRENT_USER, UPDATE_ACTIVE_ORG } from '../../common-gql-queries';
import { IOrg, IProject } from '../../models/user-service';
import ApolloErrorPage from '../ApolloErrorPage';
import ContentLoading from '../ContentLoading';

interface IProjectsTableProps {
  activeOrg: IOrg;
  activeProject?: IProject | null;
}

function ProjectsTable(props: IProjectsTableProps) {
  const { activeOrg, activeProject } = props;
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

  const getButton = (projectId: string) => {
    if (activeProjectId !== projectId) {
      return (
        <Switch
          color="primary"
          checked={false}
          onChange={(event) => activateProject(projectId)}
        />
      );
    }
    return <Switch color="primary" checked={true} />;
  };

  return (
    <React.Fragment>
      {projects ? (
        <TableContainer component="div" aria-label="Projects">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project Name</TableCell>
                <TableCell>Project ID</TableCell>
                <TableCell>{'Activate'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((proj) => (
                <TableRow key={proj.id}>
                  <TableCell>{proj.name}</TableCell>
                  <TableCell>{proj.id}</TableCell>
                  <TableCell>{getButton(proj.id)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography align="center" variant="h6">
          {'No organizations found'}
        </Typography>
      )}
    </React.Fragment>
  );
}

export default ProjectsTable;
