import React, { useState } from 'react';
import { Button, TextInput } from '@bavard/react-components';
import { Box, makeStyles, Theme, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { useSnackbar } from 'notistack';

import { IWorkspace } from '../../models/user-service';

const useStyles = makeStyles((theme: Theme) => ({
  warningIcon: {
    fontSize: 48,
    color: '#DB2317',
  },
  deleteButton: {
    backgroundColor: '#DB2317',
    width: 300,
    margin: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#CA1913',
    },
    '&:disabled': {
      backgroundColor: '#B11913',
      color: 'rgba(0,0,0,0.8)',
    },
  },
  cancelButton: {
    width: 300,
    margin: theme.spacing(1),
  },
}));

interface IDeleteWorkspaceProps {
  workspace: IWorkspace;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteWorkspace: React.FC<IDeleteWorkspaceProps> = ({
  workspace,
  onCancel,
  onConfirm,
}) => {
  const classes = useStyles();
  const [workspaceName, setWorkspaceName] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleChangeWorkspaceName = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setWorkspaceName(event.target.value);
  };

  const handleDeleteWorkspace = () => {
    if (workspaceName !== workspace.name) {
      enqueueSnackbar(`The workspace name does not match.`, {
        variant: 'error',
      });
      return;
    }
    onConfirm();
  };

  console.log(workspaceName, workspace.name);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width={400}
      p={8}>
      <WarningIcon className={classes.warningIcon} />
      <Typography variant="h6">Delete Workspace?</Typography>
      <Typography variant="subtitle1" align="center">
        {`This action cannot be undone.`}
      </Typography>
      <Box width={300}>
        <TextInput
          value={workspaceName}
          label={workspace.name}
          labelPosition="top"
          fullWidth={true}
          onChange={handleChangeWorkspaceName}
        />
      </Box>
      <Button
        title="Delete Workspace"
        color="primary"
        variant="contained"
        disabled={workspaceName !== workspace.name}
        className={classes.deleteButton}
        onClick={handleDeleteWorkspace}
      />
      <Button
        title="Cancel"
        color="inherit"
        variant="contained"
        className={classes.cancelButton}
        onClick={onCancel}
      />
    </Box>
  );
};

export default DeleteWorkspace;
