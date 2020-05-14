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
} from '@material-ui/core';
import assert from 'assert';
import clsx from 'clsx';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { UPDATE_ACTIVE_ORG } from '../../gql-queries';
import ContentLoading from '../ContentLoading';
import { useActiveOrg } from '../UseActiveOrg';

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    title: {
      fontSize: 20,
    },
  }),
);

interface IProjectProps {
  orgId: string;
  projectId: string | null;
}

function ProjectsWrapper() {
  const { orgId, projectId } = useActiveOrg();

  return orgId ? (
    <Projects orgId={orgId} projectId={projectId} />
  ) : (
    <Typography>{'No org is active.'}</Typography>
  );
}

function Projects(props: IProjectProps) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const getDataResult = useQuery(GET_DATA, {
    variables: { orgId: props.orgId },
  });
  const client = useApolloClient();

  if (getDataResult.loading) {
    return <ContentLoading />;
  }

  if (getDataResult.error) {
    // TODO: handle errors
    return <p>{JSON.stringify(getDataResult.error, null, 2)}</p>;
  }

  const { activeProject, activeOrg } = getDataResult.data.currentUser;
  const { projects } = getDataResult.data;
  const activeProjectId = activeProject ? activeProject.id : null;

  console.log('activeProjectId', activeProjectId);
  assert.equal(activeOrg.id, props.orgId);
  assert.equal(activeProjectId, props.projectId);

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

  const getButton = (projectId: string) => {
    if (props.projectId !== projectId) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setActiveProject(props.orgId, projectId)}>
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
              gutterBottom={true}>
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
    if (projects.length === 0) {
      return (
        <Typography align="center" variant="h6">
          {'No projects found'}
        </Typography>
      );
    }
    return (
      <Grid container={true} spacing={1}>
        {projects.map((project: any) => getCard(project))}
      </Grid>
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
}

export default ProjectsWrapper;
