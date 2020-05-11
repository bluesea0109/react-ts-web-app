
import { createStyles, makeStyles, Theme, Typography, List, ListItem, ListItemText } from '@material-ui/core';
import React from "react";
import ContentLoading from '../ContentLoading';
import { gql, useQuery } from '@apollo/client';
import { withActiveOrg } from "../WithActiveOrg";

const GET_COLLECTIONS = gql`
  query($projectId: String!) {
    ImageLabelingService_collections(projectId: $projectId) {
      id
      projectId
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

function CollectionsListWrapper(props: IProjectProps) {
  if (!props.projectId) {
    return <Typography>{"No project is active."}</Typography>
  }
  return <CollectionsList {...props} />
}

function CollectionsList(props: IProjectProps) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_COLLECTIONS, { variables: { projectId: props.projectId }});

  if (loading) {
    return <ContentLoading/>
  }

  if (error) {
    console.error(error);
    return <Typography>{"Unknown error occured"}</Typography>
  }

  const collections = data.ImageLabelingService_collections;

  return (
    <List className={classes.root} subheader={<li />}>
      {collections.map((col: any, i: number) => (
        <ListItem key={i}>
          <ListItemText primary={`Name: ${col.name}`} />
          <ListItemText secondary={`Id: ${col.id}`} />
        </ListItem>
      ))}
    </List>
  );
}

export default withActiveOrg(CollectionsListWrapper);
