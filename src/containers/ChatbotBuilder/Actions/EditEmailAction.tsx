import { EmailAction } from '@bavard/agent-config';
import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { TextInput } from '../../../components';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      '& .MuiOutlinedInput-input': {
        padding: '12px 12px',
      },
    },
  }),
);

interface EditEmailActionProps {
  action: EmailAction;
  onChangeAction: (action: EmailAction) => void;
}

const EditEmailAction = ({
  action,
  onChangeAction,
}: EditEmailActionProps) => {
  const classes = useStyles();

  return (
    <>
      <Grid container={true} item={true} sm={12} className={classes.input}>
        <TextInput
          fullWidth={true}
          label="Email From"
          type="email"
          variant="outlined"
          value={action.from}
          onChange={e => onChangeAction({ ...action, from: e.target.value } as EmailAction)}
        />
      </Grid>
      <Grid container={true} item={true} sm={12}>
        <TextInput
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
