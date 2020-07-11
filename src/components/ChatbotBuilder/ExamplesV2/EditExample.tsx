import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { IExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { Grid } from '@material-ui/core';

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

type EditExampleProps = {
  example?: IExample;
  onEditExampleClose: () => void;
  onSaveExample: (updatedExample: IExample) => Promise<void>;
}

const EditExample = ({ example, onEditExampleClose, onSaveExample }: EditExampleProps) => {
  const classes = useStyles();
  const [currentExample, setCurrentExample] = useState<Maybe<IExample>>(example);

  useEffect(() => {
    setCurrentExample(example);
  }, [example])

  if (!!currentExample) {
    return (
      <Dialog fullScreen open={true} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onEditExampleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Edit Example #{currentExample.id}
            </Typography>
            <Button autoFocus color="inherit" onClick={() => onSaveExample(currentExample)}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item xs={6}>
            Text Edit Area
          </Grid>
          <Grid item xs={6}>
            Text Annotation Area
          </Grid>
        </Grid>
      </Dialog>
    );
  } else return null;
}

export default EditExample;