import { TextInput } from '@bavard/react-components';
import {
  Button,
  Box,
  createStyles,
  Grid,
  LinearProgress,
  makeStyles,
  Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { IUser } from '../../../models/user-service';
import UploadDataDialog from '../UploadData/UploadDataDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    formHeading: {
      marginBottom: theme.spacing(2),
    },
    button: {
      marginBottom: theme.spacing(1),
      width: '100%',
    },
    inputBox: {
      marginBottom: theme.spacing(1),
      width: '100%',
      backgroundColor: theme.palette.background.default,
    },
  }),
);

interface INewAgentProps {
  user: IUser;
  loading: boolean;
  onAddAgent: (uname: string) => void;
}

const NewAgent: React.FC<INewAgentProps> = ({ user, loading, onAddAgent }) => {
  const classes = useStyles();
  const [uname, setUname] = useState<string>('');

  const { workspaceId } = useParams<{ workspaceId: string }>();

  const onUploadComplete = () => {
    setUname('');
  };

  const onAdd = () => {
    onAddAgent(uname);
    setUname('');
  };

  return (
    <Grid className={classes.root} container={true} item={true} xs={12} md={4}>
      {loading && <LinearProgress />}
      <Box width={1} mb={1}>
        <TextInput
          id="name"
          label="Create New Assistant"
          labelType="Typography"
          labelPosition="top"
          value={uname}
          fullWidth={true}
          onChange={(e: any) => setUname(e.target.value as string)}
        />
      </Box>
      <Button
        className={clsx([classes.button])}
        variant="contained"
        color="primary"
        disabled={loading || !uname}
        onClick={onAdd}>
        Create Without Data
      </Button>
      <UploadDataDialog
        uname={uname}
        workspaceId={workspaceId}
        buttonsDisabled={loading || !uname}
        onSuccess={onUploadComplete}
        onError={onUploadComplete}
        onCancel={onUploadComplete}
      />
    </Grid>
  );
};

export default NewAgent;
