
// import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from "react";
import ContentLoading from '../ContentLoading';
import { useQuery, gql } from '@apollo/client';

const GET_USER = gql`
  query {
    currentUser {
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

// const GET_PROJECTS = gql`
//   query ($orgId: String!) {
//     projects(orgId: $orgId) {
//       id
//       name
//     }
//   }
// `;

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       padding: theme.spacing(3),
//     },
//     title: {
//       fontSize: 20,
//     }
//   })
// );

function Projects() {
  // const classes = useStyles();
  const getUser = useQuery(GET_USER);
  // const [getProjects, getprojectsResult] = useLazyQuery(GET_PROJECTS);

  if (getUser.loading) {
    return <ContentLoading/>;
  }

  if (getUser.error) {
      // TODO: handle errors
      return <p>{JSON.stringify(getUser.error, null, 2)}</p>;
  }

  const activeOrg = getUser.data.currentUser.activeOrg;
  if (!activeOrg) {
    return null;
  }

  // const activeProject = getUser.data.currentUser.activeProject;

  return <p>TODO</p>
};

export default Projects;
