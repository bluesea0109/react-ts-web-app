import { AgentConfig, ISlot } from '@bavard/agent-config';
import { TextInput, UpTransition, Button } from '@bavard/react-components';
import {
  Box,
  CircularProgress,
  DialogContent,
  Grid,
  LinearProgress,
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
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
    return null;
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
            title="Create"
            disabled={loading}
            autoFocus={true}
            color="inherit"
            onClick={saveChanges}>
            {loading && <CircularProgress color="secondary" size={20} />}
          </Button>
        </Toolbar>
        {loading && <LinearProgress color="secondary" />}
      </AppBar>
      <DialogContent>
        <Box my={4}>
          <Grid container={true}>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <TextInput
                  label="Slot Name"
                  labelType="Typography"
                  labelPosition="top"
                  disabled={loading}
                  variant="outlined"
                  value={newSlot.name}
                  fullWidth={true}
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
                <TextInput
                  label="Slot Type"
                  labelType="Typography"
                  labelPosition="top"
                  disabled={loading}
                  variant="outlined"
                  fullWidth={true}
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
