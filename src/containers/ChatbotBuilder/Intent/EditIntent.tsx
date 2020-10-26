import { BaseAgentAction, IIntent } from '@bavard/agent-config';
import { Box, DialogContent, Grid, TextField } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from 'react';
import { DropDown } from '../../../components';
import { UpTransition } from '../../../components';
import { Maybe } from '../../../utils/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
      backgroundColor: '#2B2AC6',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    intent: {
      padding: '7px',
      fontSize: '16px',
    },
    fieldLabel: {
      marginBottom: '5px',
      fontSize: '18px',
      fontWeight: 'bold',
    },
    addIntentBtn: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);

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

  const handleChangeAction = (action: any) => {
    setCurrentIntent({...currentIntent, defaultActionName: action } as any);
  };

  console.log('>>> Current Intent: ', currentIntent);

  return (
    <Dialog fullScreen={true} open={!!intent} TransitionComponent={UpTransition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {currentIntent && `Edit Intent "${currentIntent.name}"`}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onEditIntentClose}
            aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container={true}>
          <Grid item={true} md={4} xs={12}/>
          <Grid item={true} md={4} xs={12}>
            <Box p={2}>
              <Typography className={classes.fieldLabel}>
                Intent Value
              </Typography>
              <TextField
                fullWidth={true}
                label=""
                variant="outlined"
                value={currentIntent?.name}
                onChange={(e) =>
                  setCurrentIntent({
                    ...currentIntent,
                    name: e.target.value.replace(/ /g, '+'),
                  } as any)
                }
                inputProps={{ className: classes.intent }}
              />
            </Box>
          </Grid>
          <Grid item={true} md={4} xs={12}/>
        </Grid>
        <Grid container={true}>
          <Grid item={true} md={4} xs={12}/>
          <Grid item={true} md={4} xs={12}>
            <Box p={2}>
              <Typography className={classes.fieldLabel}>
                Default Action
              </Typography>
              <DropDown
                label=""
                current={actions.find(
                  (a) => a.name === currentIntent?.defaultActionName,
                )}
                menuItems={actions}
                onChange={handleChangeAction}
                size="large"
              />
            </Box>
          </Grid>
          <Grid item={true} md={4} xs={12}/>
        </Grid>
        <Grid container={true}>
          <Grid item={true} md={4} xs={12}/>
          <Grid item={true} md={4} xs={12} className={classes.addIntentBtn}>
            <Button autoFocus={true} color="primary" variant="contained" onClick={saveChanges}>
              Save
            </Button>
          </Grid>
          <Grid item={true} md={4} xs={12}/>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default EditIntent;
