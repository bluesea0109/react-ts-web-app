import { useMutation } from '@apollo/react-hooks';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useState } from 'react';
import { DELETE_CATEGORY_SET, GET_CATEGORY_SETS } from '../../../gql-queries';
import ContentLoading from '../../ContentLoading';
import { useActiveOrg } from '../../UseActiveOrg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    selectEmpty: {
      marginTop: theme.spacing(1),
    },
    button: {
      boxShadow: 'none',
    },
    cancel: {
      backgroundColor: '#ef9a9a',
    },
  }),
);

interface IDeleteCategorySetProps {
  name: string;
  categorySetId: number;
}

function DeleteCategorySetDialog(props: IDeleteCategorySetProps) {
  const classes = useStyles();
  const [state, setState] = useState({
    open: false,
  });
  const { projectId } = useActiveOrg();
  const [deleteCategorySet, { loading, error }] = useMutation(
    DELETE_CATEGORY_SET,
    {
      onCompleted: () => {
        handleClose();
      },
      refetchQueries: [{ query: GET_CATEGORY_SETS, variables: { projectId } }],
      awaitRefetchQueries: true,
    },
  );

  const handleOpen = () => {
    setState({ ...state, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleDelete = () => {
    deleteCategorySet({
      variables: {
        categorySetId: props.categorySetId,
      },
    });
  };

  let dialogContent = (
    <DialogContent>
      <Typography variant="h6">{'Category Set'}</Typography>
      <Typography>{`Name: ${props.name}`}</Typography>
      <Typography>{`Id: ${props.categorySetId}`}</Typography>
    </DialogContent>
  );

  if (loading) {
    dialogContent = (
      <DialogContent>
        <ContentLoading />
      </DialogContent>
    );
  }

  if (error) {
    dialogContent = (
      <DialogContent>
        <Typography>{'An unexpected error occurred.'}</Typography>
      </DialogContent>
    );
  }

  return (
    <React.Fragment>
      <Dialog fullWidth={true} open={state.open} onClose={handleClose}>
        <DialogTitle>
          {'Are you sure you want to delete this category set?'}
        </DialogTitle>
        {dialogContent}
        <DialogActions>
          <Button color="primary" disabled={loading} onClick={handleClose}>
            {'Cancel'}
          </Button>
          <Button color="secondary" disabled={loading} onClick={handleDelete}>
            {'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton className={classes.button} onClick={handleOpen}>
        <DeleteIcon />
      </IconButton>
    </React.Fragment>
  );
}

export default DeleteCategorySetDialog;
