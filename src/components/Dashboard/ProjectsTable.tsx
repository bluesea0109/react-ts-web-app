
import { Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Toolbar, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import "firebase/auth";
import React from "react";
import { IProject, IOrg } from '../../models';
import { UPDATE_ACTIVE_ORG, GET_CURRENT_USER } from '../../gql-queries';
import { useMutation } from 'react-apollo';
import ContentLoading from '../ContentLoading';
import ApolloErrorPage from '../ApolloErrorPage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2)
    }
  })
);

interface IProjectsTableProps {
  activeOrg: IOrg,
  activeProject: IProject | null
}

function ProjectsTable(props: IProjectsTableProps) {
  const classes = useStyles();
  const { activeOrg, activeProject } = props;
  const [updateActiveOrg, { loading, error }] = useMutation(UPDATE_ACTIVE_ORG,
    {
      refetchQueries: [{ query: GET_CURRENT_USER }],
      awaitRefetchQueries: false,
    });

  const setActiveProject = async (orgId: string, projectId: string) => {
    updateActiveOrg({
      variables: {
        orgId,
        projectId
      },
    });
  };

  if (loading) {
    return <ContentLoading />;
  }

  if (error) {
    return <ApolloErrorPage error={error}/>
  }

  const projects = activeOrg.projects;
  const activeProjectId = activeProject?.id

  const getButton = (projectId: string) => {
    if (activeProjectId !== projectId) {
      return <Button variant="contained" color="primary" onClick={() => setActiveProject(activeOrg.id, projectId)}>Make Active</Button>
    }
    return <Button variant="contained" color="secondary" disabled>Active</Button>
  }

  
  return (
    <Paper className={classes.paper}>
      <Toolbar>
        <Typography variant="h5">{`Projects for Organization `}<em>{activeOrg.name}</em></Typography>
      </Toolbar>
      {projects ? (
        <TableContainer component={Paper} aria-label="Projects">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Project id</TableCell>
                <TableCell>{"Set to Active"}</TableCell>
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
    </Paper>
  );
}

export default ProjectsTable;