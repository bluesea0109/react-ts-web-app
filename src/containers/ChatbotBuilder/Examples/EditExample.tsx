import { Button, Grid } from '@material-ui/core';
import React, { useState } from 'react';
import FullDialog from '../../../components/dialogs/FullDialog';
import { INLUExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import ExampleForm from './ExampleForm';
import { ExamplesError } from './types';

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
  const [updatedExample, setUpdatedExample] = useState<INLUExample>();
  const isNew = example?.id === -1;

  const saveChanges = async () => {
    if (!!updatedExample) {
      await onSaveExample(updatedExample);
    }
  };

  return (
    <FullDialog
      isOpen={!!example}
      title={isNew ? 'Create NLU Example' : `Edit NLU Example #${example?.id}`}
      onEditClose={onEditExampleClose}
    >
      <ExampleForm
        loading={loading}
        example={example}
        tagTypes={tagTypes}
        intents={intents}
        onExampleUpdate={setUpdatedExample}
      />

      <Grid container={true} item={true} xs={12} justify="center">
        <Button autoFocus={true} color="primary" variant="contained" onClick={saveChanges}>
          {isNew ? 'Add Example' : 'Update Example'}
        </Button>
      </Grid>
    </FullDialog>
  );
};

export default EditExample;
