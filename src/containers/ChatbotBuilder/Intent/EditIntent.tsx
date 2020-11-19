import { BaseAgentAction, IIntent } from '@bavard/agent-config';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { FullDialog } from '../../../components';
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
    <FullDialog
      isOpen={!!intent}
      title={`Edit Intent "${currentIntent?.name}"`}
      onEditClose={onEditIntentClose}>
      <Grid container={true} justify="center">
        <Grid item={true} sm={4} xs={8}>
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
    </FullDialog>
  );
};

export default EditIntent;
