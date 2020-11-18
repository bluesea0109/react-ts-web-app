import { BaseAgentAction, IIntent } from '@bavard/agent-config';
import { DialogContent, Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from 'react';
import { UpTransition } from '../../../components';
import { Maybe } from '../../../utils/types';
import EditIntentForm from './EditIntentForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
      backgroundColor: '#2B2AC6',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    buttonGrid: {
      paddingTop: theme.spacing(3),
    },
  }),
);

type EditIntentProps = {
  intent?: IIntent;
  actions: BaseAgentAction[];
  onEditIntentClose: () => void;
  onSaveIntent: (intentData: IIntent) => void;
  error?: Error;
};

const EditIntent = ({
  intent,
  actions,
  onEditIntentClose,
  onSaveIntent,
}: EditIntentProps) => {
  const classes = useStyles();
  const [currentIntent, setCurrentIntent] = useState<Maybe<IIntent>>(intent);

  useEffect(() => {
    setCurrentIntent(intent);
  }, [intent]);

  const saveChanges = () => {
    if (currentIntent) {
      const { tableData, ...intentData } = currentIntent as any;
      onSaveIntent(intentData);
    }
  };

  return (
    <Dialog
      fullScreen={true}
      open={!!intent}
      TransitionComponent={UpTransition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {currentIntent && `Edit Intent "${currentIntent.name}"`}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onEditIntentClose}
            aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container={true} justify="center">
          <Grid item={true} sm={6} xs={8}>
            <EditIntentForm
              actions={actions}
              currentIntent={currentIntent}
              onUpdateIntent={setCurrentIntent}
            />
            <Grid
              container={true}
              item={true}
              sm={12}
              justify="center"
              className={classes.buttonGrid}>
              <Button
                autoFocus={true}
                color="primary"
                variant="contained"
                onClick={saveChanges}>
                Save Intent
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default EditIntent;
