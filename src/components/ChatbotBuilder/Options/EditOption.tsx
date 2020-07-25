import { Box, CircularProgress, DialogContent, Grid, LinearProgress } from '@material-ui/core';
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
import { IOption, IOptionInput } from './types';

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

type EditOptionProps = {
  isLoading: boolean;
  option?: IOption | IOptionInput;
  onEditOptionClose: () => void;
  onSaveOption: (optionData: IOptionInput | IOption) => void | Promise<void>;
  error?: Error;
};

const EditOption = (props: EditOptionProps) => {
  const { isLoading, option, onEditOptionClose, onSaveOption } = props;

  const classes = useStyles();
  const [currentOption, setCurrentOption] = useState<Maybe<IOption | IOptionInput>>(option);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    setCurrentOption(option);
  }, [option]);

  const saveChanges = async () => {
    if (!!currentOption) {
      const { tableData, ...optionData } = currentOption as any;
      setSaveLoading(true);
      await onSaveOption(optionData);
      setSaveLoading(false);
    }
  };

  const loading = isLoading || saveLoading;

  return (
    <Dialog fullScreen={true} open={!!option} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton disabled={loading} edge="start" color="inherit" onClick={onEditOptionClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {!(currentOption as IOption)?.id ? 'Create New Option' : `Edit Option #${(currentOption as IOption)?.id}`}
          </Typography>
          <Button disabled={loading} autoFocus={true} color="inherit" onClick={saveChanges}>
            {loading && (
              <CircularProgress
                color="secondary"
                size={20}
              />
            )}
            {!loading && (!(currentOption as IOption)?.id ? 'Create' : 'Save')}
          </Button>
        </Toolbar>
        {loading && <LinearProgress color="secondary" />}
      </AppBar>
      <DialogContent>
        <Box my={4}>
          <Grid container={true}>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditOption;
