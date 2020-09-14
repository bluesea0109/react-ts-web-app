import { BaseAgentAction, IIntent } from '@bavard/agent-config';
import { Box, DialogContent, Grid, TextField } from '@material-ui/core';
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

type EditIntentProps = {
  intent?: IIntent;
  actions: BaseAgentAction[];
  onEditIntentClose: () => void;
  onSaveIntent: (intentData: IIntent) => void;
  error?: Error;
};

const EditIntent = ({
  intent,
  actions,
  onEditIntentClose,
  onSaveIntent,
}: EditIntentProps) => {
  const classes = useStyles();
  const [currentIntent, setCurrentIntent] = useState<Maybe<IIntent>>(intent);

  useEffect(() => {
    setCurrentIntent(intent);
  }, [intent]);

  const saveChanges = () => {
    if (!!currentIntent) {
      const { tableData, ...intentData } = currentIntent as any;
      onSaveIntent(intentData);
    }
  };

  return (
    <Dialog fullScreen={true} open={!!intent} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onEditIntentClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {!currentIntent ? 'Create New Intent' : `Edit Intent "${currentIntent.name}"`}
          </Typography>
          <Button autoFocus={true} color="inherit" onClick={saveChanges}>
            {!currentIntent ? 'Create' : 'Save'}
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
                  value={currentIntent?.name}
                  onChange={e => setCurrentIntent({ ...currentIntent, name: e.target.value.replace(/ /g, '+') } as any)}
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
                  value={actions.find(a => a.name === currentIntent?.defaultActionName)}
                  onChange={(e, action) => setCurrentIntent({ ...currentIntent, defaultActionName: action?.name } as any)}
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

export default EditIntent;
