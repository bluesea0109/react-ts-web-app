
import { createStyles, makeStyles, Theme, Button, Grid, Card, CardContent, Typography, CardActions } from '@material-ui/core';
import React from "react";
import ContentLoading from '../ContentLoading';
import { gql, useQuery, useApolloClient } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';
import assert from "assert";
import clsx from "clsx";
import { UPDATE_ACTIVE_ORG } from '../../gql-queries';
import { withActiveOrg } from "../WithActiveOrg";

const GET_USER = gql`
  query {
    currentUser {
      name,
      email,
      activeOrg {
        id,
        name
      }
      activeProject {
        id,
        name
      }
    }
  }
`;

const GET_DATA = gql`
  query($orgId: String!) {
    currentUser {
      name,
      email,
      activeOrg {
        id,
        name
      }
      activeProject {
        id,
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
    }
  })
);

interface IProjectProps {
  orgId: string,
  projectId: string | null,
}

function ProjectsWrapper(props: IProjectProps) {
  if (!props.orgId) {
    return <Typography>{"No organization is active."}</Typography>
  }
  return <Projects {...props}/>
}

function Projects(props: IProjectProps) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const getDataResult = useQuery(GET_DATA, { variables: { orgId: props.orgId }});
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

  console.log("activeProjectId", activeProjectId);
  assert.equal(activeOrg.id, props.orgId);
  assert.equal(activeProjectId, props.projectId);

  const setActiveProject = async (orgId: string, projectId: string) => {
    const res = await client.mutate({
      mutation: UPDATE_ACTIVE_ORG,
      variables: {
        orgId,
        projectId
      },
      refetchQueries: [{
        query: GET_USER,
      }]
    });

    if (res.errors) {
      // TODO: handle error
    } else {
      let search = `?org=${orgId}&project=${projectId}`;
      history.push({
        pathname: location.pathname,
        search,
      });
      window.location.reload(false);
    }
  };

  const getButton = (projectId: string) => {
    if (props.projectId !== projectId) {
      return <Button variant="contained" color="primary" onClick={() => setActiveProject(props.orgId, projectId)}>Make Active</Button>
    }

    return <Button variant="contained" color="secondary" disabled>Active</Button>
  }

  const getCard = (project: any) => {
    return (
      <Grid key={project.id} item xs={12} sm={3}>
        <Card>
          <CardContent>
            <Typography className={classes.title} color="textPrimary" gutterBottom>
              {`Name: ${project.name}`}
            </Typography>
            <Typography color="textPrimary" gutterBottom>
              {`Id: ${project.id}`}
            </Typography>
          </CardContent>
          <CardActions>
            {getButton(project.id)}
          </CardActions>
        </Card>
      </Grid >
    )
  }

  const renderProjects = () => {
    if (projects.length === 0) {
      return <Typography align='center' variant="h6">{"No projects found"}</Typography>
    }
    return <Grid container spacing={1}>
      {projects.map((project: any) => getCard(project))}
    </Grid>
  }

  return (
    <div>
      <Card className={clsx(classes.root)}>
        <Typography variant="h4">{"Projects"}</Typography>
        {renderProjects()}
      </Card>
    </div>
  )
};

export default withActiveOrg(ProjectsWrapper);
