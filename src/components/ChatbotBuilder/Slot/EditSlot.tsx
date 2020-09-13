import { ISlot } from '@bavard/agent-config';
import {
  Box,
  CircularProgress,
  DialogContent,
  Grid,
  LinearProgress,
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
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    setCurrentSlot(slot);
  }, [slot]);

  const saveChanges = async () => {
    if (!currentSlot) {
      return;
    }

    const { tableData, ...slotData } = currentSlot as any;
    setSaveLoading(true);
    await onSaveSlot(slotData);
    setSaveLoading(false);
  };

  const loading = saveLoading;

  return (
    <Dialog fullScreen={true} open={!!slot} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            disabled={loading}
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
            disabled={loading}
            autoFocus={true}
            color="inherit"
            onClick={saveChanges}>
            {loading && <CircularProgress color="secondary" size={20} />}
            {!loading && (!currentSlot ? 'Create' : 'Save')}
          </Button>
        </Toolbar>
        {loading && <LinearProgress color="secondary" />}
      </AppBar>
      <DialogContent>
        <Box my={4}>
          <Grid container={true}>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <TextField
                  fullWidth={true}
                  label="Slot Name"
                  disabled={loading}
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
                  disabled={loading}
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
