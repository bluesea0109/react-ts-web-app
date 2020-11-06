import {  createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import FullDialog from '../../../components/dialogs/FullDialog';
import { INLUExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import ExampleForm from './ExampleForm';
import { ExamplesError } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rootGrid: {
      padding: theme.spacing(2),
    },
    formField: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    input: {
      '& .MuiOutlinedInput-input': {
        padding: '12px 12px',
      },
    },
  }),
);

type EditExampleProps = {
  loading: boolean;
  example?: INLUExample;
  tagTypes: string[];
  intents: string[];
  error: Maybe<ExamplesError>;
  onSaveExample: (updatedExample: INLUExample) => Promise<void>;
  onEditExampleClose: () => void;
};

const EditExample = ({
  loading,
  example,
  tagTypes,
  intents,
  onSaveExample,
  onEditExampleClose,
}: EditExampleProps) => {
  const classes = useStyles();
  const [updatedExample, setUpdatedExample] = useState<INLUExample>();
  const isNew = example?.id === -1;

  const handleSaveChanges = async () => {
    if (!updatedExample) { return; }
    console.log(updatedExample);
    if (!updatedExample.intent.length || !updatedExample.text.length) {
      return;
    }
    await onSaveExample(updatedExample);
  };

  return (
    <FullDialog
      isOpen={!!example}
      title={isNew ? 'Create NLU Example' : `Edit NLU Example #${example?.id}`}
      onEditClose={onEditExampleClose}
    >
      <Grid container={true} justify="center" className={classes.rootGrid}>
        <Grid container={true} item={true} sm={4} xs={6}>
          <Grid container={true} item={true} xs={12} justify="center">
            <Typography variant="h6">
              Add an example in natural language below to improve your
              Assistant's detection of user's intent.
            </Typography>
          </Grid>

          <ExampleForm
            isNew={isNew}
            loading={loading}
            example={example}
            tagTypes={tagTypes}
            intents={intents}
            onSaveChanges={handleSaveChanges}
            onExampleUpdate={setUpdatedExample}
          />
        </Grid>
      </Grid>
    </FullDialog>
  );
};

export default EditExample;
