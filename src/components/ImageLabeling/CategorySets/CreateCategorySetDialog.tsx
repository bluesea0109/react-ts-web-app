import { useMutation } from '@apollo/react-hooks';
import {
  Button,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import React, { useState } from 'react';
import { CREATE_CATEGORY_SET, GET_CATEGORY_SETS } from '../../../gql-queries';
import ContentLoading from '../../ContentLoading';
import { useActiveOrg } from '../../UseActiveOrg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      padding: theme.spacing(1),
    },
    menu: {
      width: 200,
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
    formControl: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    textField: {
      minWidth: 120,
      width: 200,
    },
    paper: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    categoryList: {
      padding: 0,
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
      maxHeight: 200,
    },
    ul: {
      backgroundColor: 'inherit',
      padding: 0,
    },
  }),
);

function CreateCategorySetDialog() {
  const classes = useStyles();
  const [state, setState] = useState({
    open: false,
    txt: '',
    categorySetName: '',
    categories: [],
  });
  const { projectId } = useActiveOrg();
  const [createCategorySet, { loading, error }] = useMutation(
    CREATE_CATEGORY_SET,
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

  const handleChange = (name: string) => (event: any) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleCreate = () => {
    if (state.categorySetName && state.categories) {
      createCategorySet({
        variables: {
          name: state.categorySetName,
          projectId,
          categories: state.categories,
        },
      });
    }
  };

  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const txt = e.target.result.trim();
      const categories = txt
        .trim()
        .split('\n')
        .map((x: string) => x.trim());
      setState({
        ...state,
        categories,
        txt,
      });
    };
    reader.readAsText(file);
  };

  const createDisabled = () => {
    return loading || !state.categorySetName || state.categories.length === 0;
  };

  const handleCategoriesChange = (e: any) => {
    const txt = e.target.value;
    const categories = e.target.value
      .trim()
      .split('\n')
      .map((x: string) => x.trim())
      .filter((x: string) => x !== '');
    setState({
      ...state,
      txt,
      categories,
    });
  };

  let dialogContent = (
    <DialogContent>
      <FormControl className={classes.formControl}>
        <TextField
          label="Name"
          required={true}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          value={state.categorySetName}
          onChange={handleChange('categorySetName')}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextField
          id="outlined-multiline-static"
          label="Categories"
          value={state.txt}
          onChange={handleCategoriesChange}
          multiline={true}
          rows="10"
          required={true}
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <Button className={classes.button} component="label">
          {'Browse'}
          <input
            name="categories-file"
            id="categories-file"
            accept="text/plain"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
        </Button>
      </FormControl>
    </DialogContent>
  );

  if (error) {
    dialogContent = (
      <DialogContent>
        <Typography>{'Unkown error occurred'}</Typography>
      </DialogContent>
    );
  } else if (loading) {
    dialogContent = (
      <DialogContent>
        <ContentLoading />
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
        <DialogTitle disableTypography={true}>
          <Typography variant="h6">{'New Category Set'}</Typography>
        </DialogTitle>
        {dialogContent}
        <DialogActions>
          <Button color="primary" onClick={handleClose} disabled={loading}>
            {'Cancel'}
          </Button>
          <Button
            color="secondary"
            disabled={createDisabled()}
            onClick={handleCreate}
          >
            {'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton onClick={handleOpen} style={{ padding: 6 }}>
        <Tooltip title="New Category Set" disableFocusListener={true}>
          <AddIcon color="secondary" />
        </Tooltip>
      </IconButton>
    </React.Fragment>
  );
}

export default CreateCategorySetDialog;
