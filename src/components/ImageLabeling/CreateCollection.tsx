import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography, Button } from '@material-ui/core';
import gql from "graphql-tag";
import IconButtonAdd from '../IconButtonAdd';
import { withActiveOrg, IWithActiveOrgProps } from '../WithActiveOrg';
import { useMutation } from '@apollo/client';
import ContentLoading from '../ContentLoading';

const CREATE_COLLECTION = gql`
  mutation ($projectId: String!, $name: String!) {
    ImageLabelingService_createCollection(projectId: $projectId, name: $name) {
      id
      projectId
      name
    }
  }
`;

const GET_COLLECTIONS = gql`
  query($projectId: String!) {
    ImageLabelingService_collections(projectId: $projectId) {
      id
      projectId
      name
    }
  }
`;

interface ICreateCollectionProps extends IWithActiveOrgProps {
  onCompleted?(): any,
}

function CreateCollection(props: ICreateCollectionProps) {

  const [createCollection, { loading, error, data }] = useMutation(CREATE_COLLECTION,
    {
      onCompleted: () => {
        handleClose();
      },
      refetchQueries: [{ query: GET_COLLECTIONS, variables: { projectId: props.projectId }}],
      awaitRefetchQueries: true,
    });

  const [state, setState] = useState({
    name: '',
    open: false,
  });

  const handleOpen = () => {
    setState({ ...state, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleChange = (name: string) => (event: any) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleCreate = () => {
    if (state.name && props.projectId) {
      createCollection({
        variables: {
          name: state.name,
          projectId: props.projectId,
        },
      });
    }
  };

  if (data) {
    if (props.onCompleted) {
      props.onCompleted();
    }
  }

  let dialogConent = (
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Collection Name"
        type="string"
        fullWidth
        value={state.name}
        onChange={handleChange('name')}
      />
    </DialogContent>
  );

  if (loading) {
    dialogConent = (
      <DialogContent>
        <ContentLoading />
      </DialogContent>
    );
  }

  if (error) {
    console.error(error);
    dialogConent = (
      <DialogContent>
        <Typography>{"Error"}</Typography>
      </DialogContent>
    );
  }

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        open={state.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{"New Collection"}</DialogTitle>
        {dialogConent}
        <DialogActions>
          <Button disabled={loading} onClick={handleClose}>
            {"Cancel"}
          </Button>
          <Button disabled={loading || error != null} onClick={handleCreate}>
            {"Create"}
          </Button>
        </DialogActions>
      </Dialog>
      <IconButtonAdd tooltip="New Collection" onClick={handleOpen} />
    </React.Fragment>
  );
}

export default withActiveOrg(CreateCollection);
