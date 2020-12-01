import { Button } from '@bavard/react-components';
import { Box, makeStyles, Theme, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import React from 'react';
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
        {`Do you really want to delete ${workspace.name} Workspace? This cannot be undone.`}
      </Typography>
      <Button
        title="Delete Workspace"
        color="primary"
        variant="contained"
        className={classes.deleteButton}
        onClick={onConfirm}
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
