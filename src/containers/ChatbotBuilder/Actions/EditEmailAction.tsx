import { EmailAction } from '@bavard/agent-config';
import { Grid, TextField } from '@material-ui/core';
import React from 'react';

interface EditEmailActionProps {
  action: EmailAction;
  onChangeAction: (action: EmailAction) => void;
}

const EditEmailAction = ({
  action,
  onChangeAction,
}: EditEmailActionProps) => {
  return (
    <>
      <Grid item={true} xs={6}>
        <TextField
          fullWidth={true}
          label="Email From"
          type="email"
          variant="outlined"
          value={action.from}
          onChange={e => onChangeAction({ ...action, from: e.target.value } as EmailAction)}
        />
      </Grid>
      <Grid item={true} xs={6}>
        <TextField
          fullWidth={true}
          label="Email To"
          type="email"
          variant="outlined"
          value={action.to}
          onChange={e => onChangeAction({ ...action, to: e.target.value } as EmailAction)}
        />
      </Grid>
    </>
  );
};

export default EditEmailAction;
