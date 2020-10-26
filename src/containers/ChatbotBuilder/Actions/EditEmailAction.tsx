import { EmailAction } from '@bavard/agent-config';
import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { TextInput } from '../../../components';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

interface EditEmailActionProps {
  action: EmailAction;
  onChangeAction: (field: string, value: string) => void;
}

const EditEmailAction = ({
  action,
  onChangeAction,
}: EditEmailActionProps) => {
  const classes = useStyles();

  return (
    <>
      <Grid container={true} item={true} sm={12} className={classes.formField}>
        <TextInput
          fullWidth={true}
          label="Email From"
          type="email"
          value={action.from || ''}
          className={classes.input}
          onChange={e => onChangeAction('from', e.target.value)}
        />
      </Grid>
      <Grid container={true} item={true} sm={12} className={classes.formField}>
        <TextInput
          fullWidth={true}
          label="Email To"
          type="email"
          value={action.to || ''}
          className={classes.input}
          onChange={e => onChangeAction('to', e.target.value)}
        />
      </Grid>
    </>
  );
};

export default EditEmailAction;
