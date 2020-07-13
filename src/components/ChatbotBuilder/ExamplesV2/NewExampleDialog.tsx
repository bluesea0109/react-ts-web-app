import { Box, CircularProgress, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Autocomplete } from '@material-ui/lab';
import React, { useState } from 'react';
import { IIntent } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { ExamplesError } from './types';

interface NewExampleDialogProps {
  loading: boolean;
  isOpen: boolean;
  intents: IIntent[];
  onClose: () => void;
  onCreate: (text: string, intent?: number | null) => Promise<void>;
  error: Maybe<ExamplesError>;
}

const NewExampleDialog = ({ loading, intents, isOpen, onClose, onCreate, error }: NewExampleDialogProps) => {
  const [state, setState] = useState<any>({
    text: '',
    intent: null,
  });

  const createExample = async () => {
    await onCreate(state.text, state.intent);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add New Example</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a new example please enter text and optionally choose an intent.
        </DialogContentText>
        <Box px={2} py={4}>
          <Box mb={5}>
            <Autocomplete
              disabled={loading}
              id="intentSelector"
              options={intents}
              getOptionLabel={(option: any) => option.value}
              value={intents.find((i: any) => i.id === state.intent)}
              onChange={(e, intent) => setState({ ...state, intent: intent?.id ?? null})}
              style={{ maxWidth: 300 }}
              renderInput={(params) => <TextField {...params} label="Intent (Optional)" variant="outlined" />}
            />
          </Box>
          <TextField
            label={'Text (Required)'}
            disabled={loading}
            fullWidth={true}
            multiline={true}
            variant="outlined"
            rows={5}
            value={state.text}
            onChange={e => setState({ ...state, text: e.target.value })}
            placeholder="Enter example text"
            error={!!error}
          />
          <Typography variant="caption" color="error">
            {
              error === ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE ?
                'Cannot create duplicate example entry. Please try again with different values.' :
                null
            }
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        {!loading && (
          <>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button disabled={state.text === '' || !!error} onClick={createExample} color="primary">
              Create
            </Button>
          </>
        )}
        {loading && (
          <CircularProgress size={20} color="primary" />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NewExampleDialog;
