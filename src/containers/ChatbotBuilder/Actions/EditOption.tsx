import { IResponseOption } from '@bavard/agent-config';
import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { TextInput } from '../../../components';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(3),
      paddingRight: theme.spacing(4),
      paddingBottom: theme.spacing(3),
      paddingLeft: theme.spacing(4),
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

interface EditOptionProps {
  option: IResponseOption;
  onEditOption: (option: IResponseOption) => void;
}

const EditOption = ({
  option,
  onEditOption,
}: EditOptionProps) => {
  const classes = useStyles();

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} sm={12} className={classes.formField}>
        <TextInput
          fullWidth={true}
          label="Option Name"
          variant="outlined"
          value={option.text}
          className={classes.input}
          onChange={() => {}}
        />
      </Grid>
      <Grid item={true} sm={12} className={classes.formField}>
        <TextInput
          fullWidth={true}
          label="Option Type"
          variant="outlined"
          value={option.type}
          className={classes.input}
          onChange={() => {}}
        />
      </Grid>
    </Grid>
  );
};

export default EditOption;
