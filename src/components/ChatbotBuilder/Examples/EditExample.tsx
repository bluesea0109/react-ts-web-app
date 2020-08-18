import { CircularProgress, LinearProgress } from '@material-ui/core';
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
import React, { useState } from 'react';
import { IExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import ExampleForm from './ExampleForm';
import { ExamplesError } from './types';

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
  loading: boolean;
  example?: IExample;
  tags: any;
  intents: any;
  onEditExampleClose: () => void;
  onSaveExample: (updatedExample: IExample) => Promise<void>;
  error: Maybe<ExamplesError>;
};

const EditExample = (props: EditExampleProps) => {
  const { loading, example, tags, intents, onEditExampleClose, onSaveExample, error } = props;

  const [updatedExample, setUpdatedExample] = useState<any>();

  const saveChanges = async () => {
    if (!!updatedExample) {
      await onSaveExample(updatedExample);
    }
  };

  const classes = useStyles();

  return (
    <Dialog fullScreen={true} open={!!example} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton disabled={loading} edge="start" color="inherit" onClick={onEditExampleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {example?.id === -1 ? 'Create New Example' : `Edit Example #${example?.id}`}
          </Typography>
          <Button disabled={loading} autoFocus={true} color="inherit" onClick={saveChanges}>
            {loading && (
              <CircularProgress
                color="secondary"
                size={20}
              />
            )}
            {!loading && (example?.id === -1 ? 'Create' : 'Save')}
          </Button>
        </Toolbar>
        {loading && <LinearProgress color="secondary" />}
      </AppBar>
      <ExampleForm
        loading={loading}
        example={example}
        tags={tags}
        intents={intents}
        error={error}
        onExampleUpdate={setUpdatedExample}
      />
    </Dialog>
  );
};

export default EditExample;
