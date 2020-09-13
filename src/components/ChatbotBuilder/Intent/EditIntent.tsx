import { BaseAgentAction, IIntent } from '@bavard/agent-config';
import { Box, CircularProgress, DialogContent, Grid, LinearProgress, TextField } from '@material-ui/core';
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

type EditIntentProps = {
  intent?: IIntent;
  actions: BaseAgentAction[];
  onEditIntentClose: () => void;
  onSaveIntent: (intentData: IIntent) => void | Promise<void>;
  error?: Error;
};

const EditIntent = (props: EditIntentProps) => {
  const { intent, onEditIntentClose, onSaveIntent } = props;

  const classes = useStyles();
  const [currentIntent, setCurrentIntent] = useState<Maybe<IIntent>>(intent);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    setCurrentIntent(intent);
  }, [intent]);

  const saveChanges = async () => {
    if (!!currentIntent) {
      const { tableData, ...intentData } = currentIntent as any;
      setSaveLoading(true);
      await onSaveIntent(intentData);
      setSaveLoading(false);
    }
  };

  const loading = saveLoading;

  return (
    <Dialog fullScreen={true} open={!!intent} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton disabled={loading} edge="start" color="inherit" onClick={onEditIntentClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {!currentIntent ? 'Create New Intent' : `Edit Intent "${currentIntent.name}"`}
          </Typography>
          <Button disabled={loading} autoFocus={true} color="inherit" onClick={saveChanges}>
            {loading && (
              <CircularProgress
                color="secondary"
                size={20}
              />
            )}
            {!loading && (!currentIntent ? 'Create' : 'Save')}
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
                  label="Intent Value (No Spaces Allowed)"
                  disabled={loading}
                  variant="outlined"
                  value={currentIntent}
                  onChange={e => setCurrentIntent({ ...currentIntent, value: e.target.value.replace(/ /g, '+') } as any)}
                />
              </Box>
            </Grid>
            <Grid item={true} xs={6}>
              {/* <Box p={2}>
                <Autocomplete
                  fullWidth={true}
                  disabled={loading}
                  id="intentDefaultActionSelector"
                  options={actions}
                  getOptionLabel={(option: AnyAction) => option.name}
                  value={actions.find(a => a.name === currentIntent?.defaultActionName)}
                  onChange={(e, action) => setCurrentIntent({ ...currentIntent, defaultAction: action?.id } as any)}
                  renderInput={(params) => <TextField {...params} label="Default Action" variant="outlined" />}
                />
              </Box> */}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditIntent;
