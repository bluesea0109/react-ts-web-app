import { AgentConfig, ISlot } from '@bavard/agent-config';
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
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { UpTransition } from '../../../components';
import { currentAgentConfig } from '../atoms';

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

type AddSlotProps = {
  onAddSlotClose: () => void;
};

const AddSlot = ({ onAddSlotClose }: AddSlotProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [newSlot, setNewSlot] = useState<ISlot>({
    name: '',
    type: '',
  });
  const [config, setConfig] = useRecoilState<AgentConfig | undefined>(
    currentAgentConfig,
  );
  const { enqueueSnackbar } = useSnackbar();

  if (!config) {
    return <Typography>Agent config is empty.</Typography>;
  }

  const saveChanges = () => {
    if (newSlot.name === '' || newSlot.type === '') {
      enqueueSnackbar("Slot can't be empty", { variant: 'warning' });
      return;
    }

    try {
      setLoading(true);

      const { name, type } = newSlot;
      const newConfig = _.cloneDeep<AgentConfig>(config);
      newConfig.addSlot(name, type);
      setConfig(newConfig);

      enqueueSnackbar('Slot created successfully', { variant: 'success' });
      onAddSlotClose();
    } catch (e) {
      enqueueSnackbar('Unable to create slot.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog fullScreen={true} open={true} TransitionComponent={UpTransition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            disabled={loading}
            edge="start"
            color="inherit"
            onClick={onAddSlotClose}
            aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Create New Slot
          </Typography>
          <Button
            disabled={loading}
            autoFocus={true}
            color="inherit"
            onClick={saveChanges}>
            {loading && <CircularProgress color="secondary" size={20} />}
            Create
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
                  value={newSlot.name}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      name: e.target.value,
                    })
                  }
                />
              </Box>
            </Grid>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <TextField
                  fullWidth={true}
                  label="Slot Type"
                  disabled={loading}
                  variant="outlined"
                  value={newSlot.type}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      type: e.target.value,
                    })
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

export default AddSlot;
