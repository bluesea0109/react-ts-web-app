import { createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'auto',
      padding: theme.spacing(2),
    },
    textArea: {
      width: '100%',
    },
  }),
);

export default function ChatWithAgent() {
  const [state, setState] = useState({
    dialogue: '',
    userUtterance: '',
  });

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container={true} spacing={2}>
        <Grid item={true} container={true} xs={12}>
          <Grid item={true} xs={12} md={6}>
            <TextField
              className={classes.textArea}
              id="dialogue"
              label="Dialogue"
              multiline={true}
              rows={8}
              variant="outlined"
              onChange={(e) => setState({ ...state, dialogue: e.target.value })}
              value={state.dialogue}
              contentEditable={false}
              autoFocus={false}
            />
          </Grid>
        </Grid>
        <Grid item={true} container={true} xs={12}>
          <Grid item={true} xs={12} md={6}>
            <TextField
              className={classes.textArea}
              id="message"
              label="Message"
              multiline={true}
              rows={1}
              variant="outlined"
              onChange={(e) => setState({ ...state, dialogue: e.target.value })}
              value={state.userUtterance}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
