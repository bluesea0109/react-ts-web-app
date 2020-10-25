import {
  EResponseOptionTypes,
  IHyperlinkOption,
  IImageOption,
  IIntent,
  IResponseOption,
} from '@bavard/agent-config';
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
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { UpTransition } from '../../../components';
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

type EditOptionProps = {
  option?: IResponseOption;
  isNewOption: boolean;
  intents: IIntent[];
  onAddOption: (optionData: IResponseOption) => void;
  onSaveOption: (optionData: IResponseOption) => void;
  onEditOptionClose: () => void;
};

const EditOption = ({
  option,
  isNewOption,
  intents,
  onAddOption,
  onSaveOption,
  onEditOptionClose,
}: EditOptionProps) => {
  const classes = useStyles();
  const [currentOption, setCurrentOption] = useState<Maybe<IResponseOption>>(option);
  const availableOptions = [
    EResponseOptionTypes.TEXT,
    EResponseOptionTypes.IMAGE,
    EResponseOptionTypes.HYPERLINK,
  ];

  useEffect(() => {
    setCurrentOption(option);
  }, [option]);

  const saveChanges = () => {
    if (!currentOption) {
      return;
    }

    const { ...optionData } = currentOption as any;
    isNewOption ? onAddOption(optionData) : onSaveOption(optionData);
  };

  const isHyperLinkOption = currentOption?.type === EResponseOptionTypes.HYPERLINK;
  const isRequiringIntent = currentOption?.type !== EResponseOptionTypes.HYPERLINK;
  const isImageOption = currentOption?.type === EResponseOptionTypes.IMAGE;

  return (
    <Dialog fullScreen={true} open={!!option} TransitionComponent={UpTransition}>
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
                  value={currentOption?.text || ''}
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
                  id="optionTypeSelector"
                  options={availableOptions}
                  getOptionLabel={(option: any) => option}
                  value={currentOption?.type ?? ''}
                  onChange={(e, optionType) => setCurrentOption({ ...currentOption, type: optionType as EResponseOptionTypes} as any)}
                  renderInput={(params) => <TextField {...params} label="Option Type" variant="outlined" />}
                />
              </Box>
            </Grid>
          </Grid>
          {isHyperLinkOption && (
            <Grid container={true}>
              <Grid item={true} xs={6}>
                <Box p={2}>
                  <TextField
                    fullWidth={true}
                    label="HyperLink Target"
                    variant="outlined"
                    value={(currentOption as IHyperlinkOption)?.targetLink || ''}
                    onChange={(e) =>
                      setCurrentOption({
                        ...currentOption,
                        targetLink: e.target.value,
                      } as IHyperlinkOption)
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          )}
          {isRequiringIntent && (
            <Grid container={true}>
              <Grid item={true} xs={6}>
                <Box p={2}>
                  <Autocomplete
                    fullWidth={true}
                    id="optionIntentSelector"
                    options={intents.map(intent => intent.name)}
                    getOptionLabel={(option: any) => option}
                    value={currentOption?.intent ?? null}
                    onChange={(_, optionIntent) => setCurrentOption({ ...currentOption, intent: optionIntent } as IResponseOption)}
                    renderInput={(params) => <TextField {...params} label="Option Intent" variant="outlined" />}
                  />
                </Box>
              </Grid>
            </Grid>
          )}
          {isImageOption && (
            <>
              <Grid container={true}>
                <Grid item={true} xs={6}>
                  <Box p={2}>
                    <TextField
                      fullWidth={true}
                      label="Image Name"
                      variant="outlined"
                      value={(currentOption as IImageOption)?.imageName || ''}
                      onChange={(e) =>
                        setCurrentOption({
                          ...currentOption,
                          imageName: e.target.value,
                        } as IImageOption)
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid container={true}>
                <Grid item={true} xs={6}>
                  <Box p={2}>
                    <TextField
                      fullWidth={true}
                      label="Image Caption"
                      variant="outlined"
                      value={(currentOption as IImageOption)?.caption || ''}
                      onChange={(e) =>
                        setCurrentOption({
                          ...currentOption,
                          caption: e.target.value,
                        } as IImageOption)
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditOption;
