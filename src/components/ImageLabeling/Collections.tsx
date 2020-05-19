import { useQuery } from '@apollo/react-hooks';
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import gql from 'graphql-tag';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IImageCollection } from '../../models';
import ContentLoading from '../ContentLoading';

const GET_COLLECTIONS = gql`
  query($projectId: String!) {
    ImageLabelingService_collections(projectId: $projectId) {
      id
      projectId
      name
    }
  }
`;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

interface IProjectProps {
  orgId: string;
  projectId: string | null;
}

function CollectionsListWrapper() {
  const { orgId, projectId } = useParams();

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

  const { loading, error, data } = useQuery<GetImageCollections>(GET_COLLECTIONS, { variables: { projectId: props.projectId } });
  const { orgId, projectId } = useParams();

  if (error) {
    console.error(error);
    return <Typography>{'Unknown error occured'}</Typography>;
  }

  if (loading || !data) {
    return <ContentLoading />;
  }

  const onSelectCollection = (collectionId: number) => () => {
    history.push({
      pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/images`,
    });
  };

  const collections = data.ImageLabelingService_collections;

  return (
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Id</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {collections.map((collection: any, i: number) => (
          <TableRow
            key={i}
            onClick={onSelectCollection(collection.id)}
            hover={true}
          >
            <TableCell>{collection.name}</TableCell>
            <TableCell>{collection.id}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default CollectionsListWrapper;
