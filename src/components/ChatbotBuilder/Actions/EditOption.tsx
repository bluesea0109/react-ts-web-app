import { EResponseOptionTypes, IResponseOption } from '@bavard/agent-config';
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

type EditOptionProps = {
  option?: IResponseOption;
  isNewOption: boolean;
  onSaveOption: (optionData: IResponseOption) => void;
  onEditOptionClose: () => void;
};

const EditOption = ({
  option,
  isNewOption,
  onSaveOption,
  onEditOptionClose,
}: EditOptionProps) => {
  const classes = useStyles();
  const [currentOption, setCurrentOption] = useState<Maybe<IResponseOption>>(option);
  const availableOptions = [
    EResponseOptionTypes.TEXT,
    EResponseOptionTypes.IMAGE,
    EResponseOptionTypes.HYPERLINK,
    EResponseOptionTypes.OTHER_OPTIONS,
  ];

  useEffect(() => {
    setCurrentOption(option);
  }, [option]);

  const saveChanges = () => {
    if (!currentOption) {
      return;
    }

    const { ...optionData } = currentOption as any;
    onSaveOption(optionData);
  };

  return (
    <Dialog fullScreen={true} open={!!option} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onEditOptionClose}
            aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {isNewOption
              ? 'Create New Option'
              : `Edit Option "${currentOption?.text}"`}
          </Typography>
          <Button
            autoFocus={true}
            color="inherit"
            onClick={saveChanges}>
            {isNewOption ? 'Create' : 'Save'}
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
                  label="Option Name"
                  variant="outlined"
                  value={currentOption?.text}
                  onChange={(e) =>
                    setCurrentOption({
                      ...currentOption,
                      text: e.target.value,
                    } as any)
                  }
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container={true}>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <Autocomplete
                  fullWidth={true}
                  id="actionTypeSelector"
                  options={availableOptions}
                  getOptionLabel={(option: any) => option}
                  value={currentOption?.type ?? null}
                  onChange={(e, optionType) => setCurrentOption({ ...currentOption, type: optionType as EResponseOptionTypes} as any)}
                  renderInput={(params) => <TextField {...params} label="Option Type" variant="outlined" />}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container={true}>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <TextField
                  fullWidth={true}
                  label="Option Intent"
                  variant="outlined"
                  value={currentOption?.intent}
                  onChange={(e) =>
                    setCurrentOption({
                      ...currentOption,
                      intent: e.target.value,
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

export default EditOption;
