import { useMutation } from '@apollo/react-hooks';
import { Button, TextField, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';
import ContentLoading from '../../ContentLoading';
import IconButtonAdd from '../../IconButtons/IconButtonAdd';
import { CREATE_EXAMPLE, GET_EXAMPLES } from '../../../common-gql-queries';



interface ICreateExampleProps {
  onCompleted?(): any;
  intentId : string | null;
}

function CreateExample(props: ICreateExampleProps) {
  const {intentId} = props;
  const numIntentId = Number(intentId);
  const [createExample, { loading, error, data }] = useMutation(CREATE_EXAMPLE,
    {
      onCompleted: () => {
        handleClose();
      },
      refetchQueries: [{ query: GET_EXAMPLES, variables: { intentId: numIntentId  } }],
      awaitRefetchQueries: true,
    },
  );

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
    if (state.name && intentId) {
        createExample({
        variables: {
            intentId: numIntentId, 
            text: state.name
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
        autoFocus={true}
        margin="dense"
        id="name"
        label="Example Name"
        type="string"
        fullWidth={true}
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
        <Typography>{'Error'}</Typography>
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
        <DialogTitle id="form-dialog-title">{'New Example'}</DialogTitle>
        {dialogConent}
        <DialogActions>
          <Button color="primary" disabled={loading} onClick={handleClose}>
            {'Cancel'}
          </Button>
          <Button
            color="secondary"
            disabled={loading || error != null}
            onClick={handleCreate}
          >
            {'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <IconButtonAdd tooltip="New Example" onClick={handleOpen} />
    </React.Fragment>
  );
}

export default CreateExample;
