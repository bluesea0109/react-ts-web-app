import { ISlot } from '@bavard/agent-config';
import {
  Box,
  DialogContent,
  Grid,
  TextField,
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { TransitionProps } from '@material-ui/core/transitions';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from 'react';
import { Maybe } from '../../../utils/types';

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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type EditSlotProps = {
  slot?: ISlot;
  onEditSlotClose: () => void;
  onSaveSlot: (slotData: ISlot) => void | Promise<void>;
  error?: Error;
};

const EditSlot = (props: EditSlotProps) => {
  const { slot, onEditSlotClose, onSaveSlot } = props;

  const classes = useStyles();
  const [currentSlot, setCurrentSlot] = useState<Maybe<ISlot>>(slot);

  useEffect(() => {
    setCurrentSlot(slot);
  }, [slot]);

  const saveChanges = async () => {
    if (!currentSlot) {
      return;
    }

    const { ...slotData } = currentSlot as any;
    onSaveSlot(slotData);
  };

  return (
    <Dialog fullScreen={true} open={!!slot} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onEditSlotClose}
            aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {!currentSlot
              ? 'Create New Slot'
              : `Edit Slot "${currentSlot.name}"`}
          </Typography>
          <Button
            autoFocus={true}
            color="inherit"
            onClick={saveChanges}>
            {!currentSlot ? 'Create' : 'Save'}
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Box my={4}>
          <Grid container={true}>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <TextField
                  fullWidth={true}
                  label="Slot Name"
                  variant="outlined"
                  value={currentSlot?.name}
                  onChange={(e) =>
                    setCurrentSlot({
                      ...currentSlot,
                      name: e.target.value,
                    } as any)
                  }
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container={true}>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <TextField
                  fullWidth={true}
                  label="Slot Type"
                  variant="outlined"
                  value={currentSlot?.type}
                  onChange={(e) =>
                    setCurrentSlot({
                      ...currentSlot,
                      type: e.target.value,
                    } as any)
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditSlot;
