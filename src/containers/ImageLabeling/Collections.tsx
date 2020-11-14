import { useQuery } from '@apollo/client';
import {
  makeStyles,
  Toolbar,
  Theme,
  createStyles,
  Typography,
} from '@material-ui/core';
import gql from 'graphql-tag';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IImageCollection } from '../../models/image-labeling-service';
import ContentLoading from '../ContentLoading';
import { CommonTable } from '../../components';
import CreateCollection from './CreateCollection';

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
    table: {
      minWidth: 650,
    },
    toolbar: {
      paddingLeft: theme.spacing(2),
    },
  }),
);

interface IProjectProps {
  orgId: string;
  projectId: string | null;
}

function CollectionsListWrapper() {
  const { orgId, projectId } = useParams<{
    orgId: string;
    projectId: string;
  }>();

  if (!orgId) {
    return <Typography>{'No org is active.'}</Typography>;
  }
  if (!projectId) {
    return <Typography>{'No project is active.'}</Typography>;
  }
  return <CollectionsList orgId={orgId} projectId={projectId} />;
}

function CollectionsList(props: IProjectProps) {
  const classes = useStyles();
  const history = useHistory();

  interface GetImageCollections {
    ImageLabelingService_collections: IImageCollection[];
  }

  const { loading, error, data } = useQuery<GetImageCollections>(
    GET_COLLECTIONS,
    { variables: { projectId: props.projectId } },
  );
  const { orgId, projectId } = useParams<{
    orgId: string;
    projectId: string;
  }>();

  if (error) {
    console.error(error);
    return <Typography>{'Unknown error occured'}</Typography>;
  }

  if (loading || !data) {
    return <ContentLoading />;
  }

  const onSelectCollection = (collectionId: number) => {
    history.push({
      pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/images`,
    });
  };

  const collections = data.ImageLabelingService_collections;

  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'Id', field: 'id' },
  ];

  return (
    <CommonTable
      data={{
        columns,
        rowsData: collections,
      }}
      eventHandlers={{
        onRowClick: (collection: IImageCollection) =>
          onSelectCollection(collection.id),
      }}
      components={{
        Toolbar: () => (
          <Toolbar
            variant="dense"
            disableGutters={true}
            className={classes.toolbar}>
            <Typography variant="h6">{'Collections'}</Typography>
            <CreateCollection />
          </Toolbar>
        ),
      }}
    />
  );
}

export default CollectionsListWrapper;
