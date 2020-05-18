import { useApolloClient, useQuery } from '@apollo/react-hooks';
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import assert from 'assert';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { UPDATE_ACTIVE_ORG } from '../../gql-queries';
import ContentLoading from '../ContentLoading';
import { useActiveOrg } from '../UseActiveOrg';
import { IUser, IProject } from '../../models';
import gql from 'graphql-tag';

const GET_USER = gql`
  query {
    currentUser {
      name
      email
      activeOrg {
        id
        name
      }
      activeProject {
        id
        name
      }
    }
  }
`;

const GET_DATA = gql`
  query($orgId: String!) {
    currentUser {
      name
      email
      activeOrg {
        id
        name
      }
      activeProject {
        id
        name
      }
    }

    projects(orgId: $orgId) {
      id
      name
    }
  }
`;

interface IProjectProps {
  orgId: string;
  projectId: string | null;
}

interface IGetData {
  currentUser: IUser;
  projects: IProject[];
}

function ProjectsWrapper() {
  const { orgId, projectId } = useActiveOrg();

  return orgId ? (
    <Projects orgId={orgId} projectId={projectId} />
  ) : (
    <Typography>{'No org is active.'}</Typography>
  );
}

const Projects: React.FC<IProjectProps> = ({ orgId, projectId }) => {
  const history = useHistory();
  const location = useLocation();
  const { loading, error, data } = useQuery<IGetData>(GET_DATA, {
    variables: { orgId },
  });
  const client = useApolloClient();

  if (loading) {
    return <ContentLoading />;
  }

  if (error) {
    // TODO: handle errors
    return <p>{JSON.stringify(error, null, 2)}</p>;
  }

  const user = data?.currentUser as IUser;
  const { activeProject, activeOrg } = user;
  const { projects } = data as IGetData;
  const activeProjectId = activeProject?.id;

  console.log('activeProjectId', activeProjectId);
  assert.equal(activeOrg.id, orgId);
  assert.equal(activeProjectId, projectId);

  const setActiveProject = async (orgId: string, projectId: string) => {
    const res = await client.mutate({
      mutation: UPDATE_ACTIVE_ORG,
      variables: {
        orgId,
        projectId,
      },
      refetchQueries: [
        {
          query: GET_USER,
        },
      ],
    });

    if (res.errors) {
      // TODO: handle error
    } else {
      const search = `?org=${orgId}&project=${projectId}`;
      history.push({
        pathname: location.pathname,
        search,
      });
      window.location.reload(false);
    }
  };

  const getButton = (_projectId: string) => {
    return projectId !== _projectId ? (
      <Button
        variant="contained"
        color="primary"
        onClick={() => setActiveProject(orgId, _projectId)}
      >
        Make Active
      </Button>
    ) : (
      <Button variant="contained" color="secondary" disabled={true}>
        Active
      </Button>
    );
  };

  return (
    <>
      <Typography variant="h4">{'Projects'}</Typography>
      {projects?.length !== 0 ? (
        <TableContainer component={Paper} aria-label="Projects">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Project id</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell component="th" scope="row">
                    {project.id}
                  </TableCell>
                  <TableCell align="left">{project.name}</TableCell>
                  <TableCell align="left">{getButton(project.id)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography align="center" variant="h6">
          {'No projects found'}
        </Typography>
      )}
    </>
  );
};

export default ProjectsWrapper;
