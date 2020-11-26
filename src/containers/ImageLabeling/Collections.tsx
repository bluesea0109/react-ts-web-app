import { useQuery } from '@apollo/client';
import { CommonTable } from '@bavard/react-components';
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
import CreateCollection from './CreateCollection';

const GET_COLLECTIONS = gql`
  query($workspaceId: String!) {
    ImageLabelingService_collections(workspaceId: $workspaceId) {
      id
      workspaceId
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

interface ICollectionsListProps {
  workspaceId: string;
}

function CollectionsListWrapper() {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  if (!workspaceId) {
    return <Typography>{'No workspace is active.'}</Typography>;
  }
  return <CollectionsList workspaceId={workspaceId} />;
}

function CollectionsList(props: ICollectionsListProps) {
  const classes = useStyles();
  const history = useHistory();

  interface GetImageCollections {
    ImageLabelingService_collections: IImageCollection[];
  }

  const { loading, error, data } = useQuery<GetImageCollections>(
    GET_COLLECTIONS,
    { variables: { workspaceId: props.workspaceId } },
  );
  const { workspaceId } = useParams<{
    workspaceId: string;
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
      pathname: `/workspaces/${workspaceId}/image-labeling/collections/${collectionId}/images`,
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
