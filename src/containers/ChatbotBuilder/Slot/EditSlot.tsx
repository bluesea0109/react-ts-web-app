import { ISlot } from '@bavard/agent-config';
import { TextInput, UpTransition, Button } from '@bavard/react-components';
import { Box, DialogContent, Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
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

type EditSlotProps = {
  slot?: ISlot;
  onEditSlotClose: () => void;
  onSaveSlot: (slotData: ISlot) => void;
  error?: Error;
};

const EditSlot = ({ slot, onEditSlotClose, onSaveSlot }: EditSlotProps) => {
  const classes = useStyles();
  const [currentSlot, setCurrentSlot] = useState<Maybe<ISlot>>(slot);

  useEffect(() => {
    setCurrentSlot(slot);
  }, [slot]);

  const saveChanges = () => {
    if (!currentSlot) {
      return;
    }

    const { ...slotData } = currentSlot as any;
    onSaveSlot(slotData);
  };

  return (
    <Dialog fullScreen={true} open={!!slot} TransitionComponent={UpTransition}>
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
            title={!currentSlot ? 'Create' : 'Save'}
            autoFocus={true}
            color="inherit"
            onClick={saveChanges}
          />
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Box my={4}>
          <Grid container={true}>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <TextInput
                  fullWidth={true}
                  label="Slot Name"
                  labelType="Typography"
                  labelPosition="top"
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
                <TextInput
                  label="Slot Type"
                  labelType="Typography"
                  labelPosition="top"
                  variant="outlined"
                  value={currentSlot?.type}
                  fullWidth={true}
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
