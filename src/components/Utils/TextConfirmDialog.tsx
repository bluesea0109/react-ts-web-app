import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';

interface ITextConfirmDialogProps {
  title: string;
  children: string;
  open: boolean;
  confirmText: string;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
}
const TextConfirmDialog: React.FC<ITextConfirmDialogProps> = (props) => {
  const { title, children, open, setOpen, onConfirm, confirmText } = props;
  const [text, setText] = useState<string>('');
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog">
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="confirmText"
          label="Confirmation Text"
          type="text"
          fullWidth
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
              onConfirm();
            }
          }}
          color="default">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default TextConfirmDialog;
