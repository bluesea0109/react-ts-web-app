import { IIntent } from '@bavard/agent-config';
import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import FullDialog from '../../../components/dialogs/FullDialog';
import { INLUExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import ExampleForm from './ExampleForm';
import { ExamplesError } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
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
  example: INLUExample;
  tagTypes: string[];
  intent: IIntent;
  error: Maybe<ExamplesError>;
  onSaveExample: (updatedExample: INLUExample) => Promise<void>;
  onEditExampleClose: () => void;
};

const EditExample = ({
  loading,
  example,
  tagTypes,
  intent,
  onSaveExample,
  onEditExampleClose,
}: EditExampleProps) => {
  const classes = useStyles();
  const [updatedExample, setUpdatedExample] = useState<INLUExample>(example);
  const { enqueueSnackbar } = useSnackbar();
  const isNew = example?.id === -1;

  const handleSaveChanges = async () => {
    if (
      !updatedExample ||
      !updatedExample.intent.length ||
      !updatedExample.text.length
    ) {
      enqueueSnackbar(`The required field(s) is missing for the example.`, {
        variant: 'error',
      });
      return;
    }
    await onSaveExample(updatedExample);
  };

  return (
    <FullDialog
      isOpen={!!example}
      title={
        isNew
          ? 'Add a New Natural Language Example'
          : `Edit a Natural Language Example #${example?.id}`
      }
      onEditClose={onEditExampleClose}>
      <Grid container={true} justify="center" className={classes.root}>
        <Grid container={true} item={true} sm={4} xs={8}>
          <Grid
            container={true}
            item={true}
            xs={12}
            justify="center"
            className={classes.formField}>
            <Typography variant="subtitle1">
              {
                "Edit or add an example in natural language below to improve your Assistant's detection of the user's input."
              }
            </Typography>
          </Grid>
          <ExampleForm
            isNew={isNew}
            loading={loading}
            example={updatedExample}
            tagTypes={tagTypes}
            intent={intent}
            onSaveChanges={handleSaveChanges}
            onExampleUpdate={setUpdatedExample}
          />
        </Grid>
      </Grid>
    </FullDialog>
  );
};

export default EditExample;
