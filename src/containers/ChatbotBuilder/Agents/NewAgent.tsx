import { TextInput } from '@bavard/react-components';
import {
  Button,
  createStyles,
  Grid,
  LinearProgress,
  makeStyles,
  Theme,
  Typography,
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
    <Grid className={classes.root}>
      <Grid xs={12} item={true}>
        <Typography variant="subtitle1" className={classes.formHeading}>
          Create New Assistant
        </Typography>
      </Grid>
      <Grid xs={12} md={4} item={true}>
        {loading && <LinearProgress />}
        <TextInput
          id="name"
          label="Unique Name"
          value={uname}
          onChange={(e: any) => setUname(e.target.value as string)}
        />
        <br />
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
    </Grid>
  );
};

export default NewAgent;
