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
import { Autocomplete } from '@material-ui/lab';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { IIntent } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { IOption, IOptionInput, IOptionType } from './types';

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
  intents: IIntent[];
  onEditOptionClose: () => void;
  onSaveOption: (optionData: IOptionInput | IOption) => void | Promise<void>;
  error?: Error;
};

const EditOption = (props: EditOptionProps) => {
  const { isLoading, option, intents, onEditOptionClose, onSaveOption } = props;

  const classes = useStyles();
  const [currentOption, setCurrentOption] = useState<Maybe<IOption | IOptionInput>>(option);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);

  useEffect(() => {
    setCurrentOption(option);
  }, [option]);

  const saveChanges = async () => {
    if (!!currentOption) {
      const { tableData, ...optionData } = currentOption as any;
      console.log(optionData);
      setSaveLoading(true);
      await onSaveOption(optionData);
      setSaveLoading(false);
    }
  };

  const loading = isLoading || isFileLoading || saveLoading;
  const optionTypes = Object.values(IOptionType);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setIsFileLoading(true);
    console.log(file);
    setTimeout(() => {
      setIsFileLoading(false);
    }, 5000);
  };

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
            <Grid item={true} xs={6}>
              <Box p={2}>
                <Autocomplete
                  disabled={loading}
                  id="intentSelector"
                  options={intents}
                  getOptionLabel={(option: any) => option.value}
                  value={intents.find((i: any) => i.id === currentOption?.intentId)}
                  onChange={(e, intent) => setCurrentOption({ ...currentOption, intentId: intent?.id } as any)}
                  renderInput={(params) => <TextField {...params} label="Intent" variant="outlined" />}
                />
              </Box>
            </Grid>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <Autocomplete
                  disabled={loading}
                  id="typeSelector"
                  options={optionTypes}
                  getOptionLabel={(option: any) => option}
                  value={optionTypes.find((type: string) => type === currentOption?.type)}
                  onChange={(e, type) => setCurrentOption({ ...currentOption, type } as any)}
                  renderInput={(params) => <TextField {...params} label="Option Type" variant="outlined" />}
                />
              </Box>
            </Grid>
            {currentOption?.type === IOptionType.TEXT && (
              <Grid item={true} xs={12}>
                <Box p={2}>
                  <TextField
                    label="Option Text"
                    disabled={loading}
                    fullWidth={true}
                    multiline={true}
                    variant="outlined"
                    rows={4}
                    value={currentOption?.text}
                    onChange={e => setCurrentOption({ ...currentOption, text: e.target.value } as any)}
                  />
                </Box>
              </Grid>
            )}
            {currentOption?.type === IOptionType.IMAGE_LIST && (
              <>
                <Grid item={true}>
                  <Box p={2}>
                    <Button
                      variant="contained"
                      component="label"
                      style={{ padding: 6 }}>
                      Add Image
                      <input
                        name="image"
                        id="image"
                        accept="image/*"
                        type="file"
                        style={{ display: 'none' }}
                        multiple={false}
                        onChange={handleImageUpload}
                      />
                    </Button>
                  </Box>
                </Grid>
                <Grid item={true} xs={12}>
                  <Box p={2}>
                    <TextField
                      label="Option Text"
                      disabled={loading}
                      fullWidth={true}
                      multiline={true}
                      variant="outlined"
                      rows={4}
                      value={currentOption?.text}
                      onChange={e => setCurrentOption({ ...currentOption, text: e.target.value } as any)}
                    />
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditOption;
