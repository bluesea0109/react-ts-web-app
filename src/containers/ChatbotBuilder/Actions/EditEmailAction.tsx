import { IAgentEmailAction } from '@bavard/agent-config';
import { TextInput } from '@bavard/react-components';
import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';

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
  action: IAgentEmailAction;
  onChangeAction: (action: IAgentEmailAction) => void;
}

const EditEmailAction = ({ action, onChangeAction }: EditEmailActionProps) => {
  const classes = useStyles();

  return (
    <>
      <Grid container={true} item={true} sm={12} className={classes.formField}>
        <TextInput
          type="email"
          label="Email To"
          labelType="Typography"
          labelPosition="top"
          value={action.to || ''}
          fullWidth={true}
          className={classes.input}
          onChange={(e) => onChangeAction({ ...action, to: e.target.value })}
        />
      </Grid>
    </>
  );
};

export default EditEmailAction;
