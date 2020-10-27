import { IAgentUtteranceAction } from '@bavard/agent-config';
import { Grid } from '@material-ui/core';
import React from 'react';
import RichTextInput from '../../Utils/RichTextInput';

interface EditUtteranceActionProps {
  action: IAgentUtteranceAction;
  onChangeAction: (action: IAgentUtteranceAction) => void;
}

const EditUtteranceAction = ({
  action,
  onChangeAction,
}: EditUtteranceActionProps) => {
  return (
    <Grid container={true} item={true} sm={12}>
      <RichTextInput
        label="Action Text"
        value={action.utterance || ''}
        onChange={(html: string) => onChangeAction({ ...action, utterance: html })}
      />
    </Grid>
  );
};

export default EditUtteranceAction;
