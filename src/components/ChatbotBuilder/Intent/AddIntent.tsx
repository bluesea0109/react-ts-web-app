import { AgentConfig, BaseAgentAction, IIntent } from '@bavard/agent-config';
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
import { Autocomplete } from '@material-ui/lab';
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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type AddIntentProps = {
  actions: BaseAgentAction[];
  onAddIntentClose: () => void;
  tags: string[];
};

const AddIntent = ({
  actions,
  onAddIntentClose,
}: AddIntentProps) => {
  const classes = useStyles();
  const [newIntent, setNewIntent] = useState<IIntent>({
    name: '',
    defaultActionName: undefined,
  });
  const { enqueueSnackbar } = useSnackbar();

  const [config, setConfig] = useRecoilState<AgentConfig | undefined>(currentAgentConfig);

  if (!config) {
    return <p>Agent config is empty.</p>;
  }

  const saveChanges = () => {
    if (newIntent.name === '') {
      enqueueSnackbar('Intent can\'t be empty', { variant: 'warning' });
      return;
    }

    const { name, defaultActionName } = newIntent;
    const newConfig = _.cloneDeep(config);
    newConfig.addIntent(name, defaultActionName);
    setConfig(newConfig);

    enqueueSnackbar('Intent created successfully', { variant: 'success' });
    onAddIntentClose();
  };

  return (
    <Dialog fullScreen={true} open={true} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onAddIntentClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Create New Intent
          </Typography>
          <Button autoFocus={true} color="inherit" onClick={saveChanges}>
            Create
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
                  label="Intent Value (No Spaces Allowed)"
                  variant="outlined"
                  value={newIntent.name}
                  onChange={e => setNewIntent({ ...newIntent, name: e.target.value.replace(/ /g, '+') })}
                />
              </Box>
            </Grid>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <Autocomplete
                  fullWidth={true}
                  id="intentDefaultActionSelector"
                  options={actions}
                  getOptionLabel={(option: BaseAgentAction) => option.name}
                  value={actions.find(a => a.name === newIntent?.defaultActionName)}
                  onChange={(e, action) => setNewIntent({ ...newIntent, defaultActionName: action?.name })}
                  renderInput={(params) => <TextField {...params} label="Default Action" variant="outlined" />}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddIntent;
