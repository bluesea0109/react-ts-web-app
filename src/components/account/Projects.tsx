import { gql, useApolloClient, useQuery } from '@apollo/client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  createStyles,
  Grid,
  makeStyles,
  Theme,
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
import clsx from 'clsx';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { UPDATE_ACTIVE_ORG } from '../../gql-queries';
import ContentLoading from '../ContentLoading';
import { useActiveOrg } from '../UseActiveOrg';
import { IUser, IProject } from '../../models';

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    title: {
      fontSize: 20,
    },
    table: {
      minWidth: 650,
    },
  })
);

function ProjectsWrapper() {
  const { orgId, projectId } = useActiveOrg();

  return orgId ? (
    <Projects orgId={orgId} projectId={projectId} />
  ) : (
    <Typography>{'No org is active.'}</Typography>
  );
}

const Projects: React.FC<IProjectProps> = ({ orgId, projectId }) => {
  const classes = useStyles();
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
    if (projectId !== _projectId) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setActiveProject(orgId, _projectId)}
        >
          Make Active
        </Button>
      );
    }

    return (
      <Button variant="contained" color="secondary" disabled={true}>
        Active
      </Button>
    );
  };

  const getCard = (project: any) => {
    return (
      <Grid key={project.id} item={true} xs={12} sm={3}>
        <Card>
          <CardContent>
            <Typography
              className={classes.title}
              color="textPrimary"
              gutterBottom={true}
            >
              {`Name: ${project.name}`}
            </Typography>
            <Typography color="textPrimary" gutterBottom={true}>
              {`Id: ${project.id}`}
            </Typography>
          </CardContent>
          <CardActions>{getButton(project.id)}</CardActions>
        </Card>
      </Grid>
    );
  };

  const renderProjects = () => {
    return projects?.length !== 0 ? (
      // <Grid container={true} spacing={1}>
      //   {projects.map((project: any) => getCard(project))}
      // </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="right">Project id</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell component="th" scope="row">
                  {project.id}
                </TableCell>
                <TableCell align="right">{project.name}</TableCell>
                <TableCell align="right">{getButton(project.id)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Typography align="center" variant="h6">
        {'No projects found'}
      </Typography>
    );
  };

  return (
    <div>
      <Card className={clsx(classes.root)}>
        <Typography variant="h4">{'Projects'}</Typography>
        {renderProjects()}
      </Card>
    </div>
  );
};

export default ProjectsWrapper;
