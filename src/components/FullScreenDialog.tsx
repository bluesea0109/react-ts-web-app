import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Theme,
  DialogProps,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { createStyles, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flex: 1,
    },
    root: {
      backgroundColor: theme.palette.background.default,
    },
    content: {
      marginTop: theme.spacing(10),
    },
  })
);

interface IProps {
  title?: string;
  children?: React.ReactNode;
  open: boolean;
  onClose?: () => void;
}

const CreateGraphPolicyDialog = ({
  open,
  title,
  children,
  onClose,
}: IProps) => {
  const [isOpen, setOpen] = useState(open || false);
  const closeDialog = () => {
    onClose?.();
    setOpen(false);
  };

  const classes = useStyles();

  return (
    <Dialog
      className={classes.root}
      fullScreen
      open={isOpen}
      onClose={closeDialog}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={closeDialog}
            aria-label="close">
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.content}>{children}</DialogContent>
    </Dialog>
  );
};

export default CreateGraphPolicyDialog;
