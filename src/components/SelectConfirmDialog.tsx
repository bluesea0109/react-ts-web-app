import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState } from 'react';

interface ISelectConfirmDialogProps {
  title: string;
  children: string;
  open: boolean;
  confirmText: string;
  intents: string[];
  setOpen: (open: boolean) => void;
  onConfirm: (validIntent: string) => void;
}
const SelectConfirmDialog: React.FC<ISelectConfirmDialogProps> = (props) => {
  const {
    title,
    children,
    open,
    intents,
    setOpen,
    onConfirm,
    confirmText,
  } = props;
  const [text, setText] = useState<string>('');
  const [validIntent, setValidIntent] = useState<string>('');

  const setUpdatingIntent = (
    event: React.ChangeEvent<Record<string, unknown>>,
    intent: string | null,
  ) => {
    setValidIntent(intent ?? '');
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog">
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
        <Autocomplete
          id="intents"
          options={intents}
          getOptionLabel={(option: any) => option}
          style={{}}
          onChange={setUpdatingIntent}
          renderInput={(params) => (
            <TextField {...params} label="Valid intents" variant="outlined" />
          )}
        />
        <TextField
          autoFocus={true}
          margin="dense"
          id="confirmText"
          label="Confirmation Text"
          type="text"
          fullWidth={true}
          onChange={(e: any) => setText(e.target.value as string)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => setOpen(false)}
          color="secondary">
          No
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (text === confirmText) {
              setOpen(false);
              onConfirm(validIntent);
            }
          }}
          color="default">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default SelectConfirmDialog;
