import { BaseAgentAction, IIntent } from '@bavard/agent-config';
import { FullDialog, Button } from '@bavard/react-components';
import { Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
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
      onClose={onEditIntentClose}>
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
              title="Save Intent"
              autoFocus={true}
              color="primary"
              variant="contained"
              onClick={saveChanges}
            />
          </Grid>
        </Grid>
      </Grid>
    </FullDialog>
  );
};

export default EditIntent;
