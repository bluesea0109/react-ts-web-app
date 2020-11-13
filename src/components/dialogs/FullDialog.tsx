import {
  AppBar,
  createStyles,
  Dialog,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { UpTransition } from '../Transitions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);

interface IFullDialogProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onEditClose: () => void;
}

const FullDialog = ({
  children,
  title,
  isOpen,
  onEditClose,
}: IFullDialogProps) => {
  const classes = useStyles();

  return (
    <Dialog open={isOpen} fullScreen={true} TransitionComponent={UpTransition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onEditClose}
            aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  );
};
export default FullDialog;
