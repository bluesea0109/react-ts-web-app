import { UtteranceAction } from '@bavard/agent-config';
import { Grid } from '@material-ui/core';
import React from 'react';
import RichTextInput from '../../Utils/RichTextInput';

interface EditUtteranceActionProps {
  action: UtteranceAction;
  onChangeAction: (action: UtteranceAction) => void;
}

const EditUtteranceAction = ({
  action,
  onChangeAction,
}: EditUtteranceActionProps) => {
  return (
    <Grid item={true} sm={12}>
      <RichTextInput
        label="Action Text"
        value={action.utterance}
        onChange={(html: string) => onChangeAction({ ...action, utterance: html } as UtteranceAction)}
      />
    </Grid>
  );
};

export default EditUtteranceAction;
