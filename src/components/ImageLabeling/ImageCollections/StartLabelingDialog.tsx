import { Button, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GraphQLError } from 'graphql';
import React, { useState } from 'react';
import IconButtonPlay from '../../IconButtons/IconButtonPlay';

interface IStartLabelingDialogState {
  open: boolean;
  error: GraphQLError | null;
  mode: string;
  batchSize: number;
}

function StartLabelingDialog() {
  const [state, setState] = useState<IStartLabelingDialogState>({
    open: false,
    error: null,
    mode: 'single',
    batchSize: 15,
  });

  const handleOpen = () => {
    setState({
      ...state,
      open: true,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setState({ ...state, mode: value })
  };

  const handleChangeBatchSize = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let batchSize = parseInt(event.target.value, 10);
    batchSize = Math.min(batchSize, 50);
    batchSize = Math.max(batchSize, 1);
    setState({ ...state, batchSize })
  };

  const beginDisabled = () => {
    if (state.mode === 'single') {
      return false;
    }

    if (state.batchSize < 1 || state.batchSize > 50) {
      return true;
    }
  }

  let dialogContent = (
    <DialogContent>
      <FormControl component="fieldset">
        <FormLabel component="legend">{"Mode"}</FormLabel>
        <RadioGroup aria-label="mode" name="gender1" value={state.mode} onChange={handleChange}>
          <FormControlLabel value="single" control={<Radio />} label="Single - label one image at a time" />
          <FormControlLabel value="batch" control={<Radio />} label="Batch - label batches of images (supports category labeling only)" />
          <FormControl component="fieldset">
            <TextField
              disabled={state.mode !== 'batch'}
              onChange={handleChangeBatchSize}
              value={state.batchSize}
              id="standard-number"
              label="Batch Size"
              type="number"
              size="small"
            />
          </FormControl>
        </RadioGroup>
      </FormControl>
    </DialogContent>
  );

  if (state.error) {
    dialogContent = (
      <DialogContent>
        <Typography>{state.error.message}</Typography>
      </DialogContent>
    );
  }

  const beginLabeling = () => {

  }

  return (
    <React.Fragment>
      <Dialog
        open={state.open}
        onClose={handleClose}
        fullWidth={true}
      >
        <DialogTitle>{'Start Labeling Images'}</DialogTitle>
        {dialogContent}
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            {'Cancel'}
          </Button>
          <Button color="secondary" onClick={beginLabeling} disabled={beginDisabled()}>
            {'Begin'}
          </Button>
        </DialogActions>
      </Dialog>
      <IconButtonPlay tooltip="Start Labeling" onClick={handleOpen} />
    </React.Fragment>
  );
}

export default StartLabelingDialog;
