import { useQuery } from '@apollo/react-hooks';
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
import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IIntent } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { getImageOptionUploadUrlQuery } from './gql';
import { GetImageOptionUploadUrlQueryResult, IOption, IOptionInput, IOptionType } from './types';

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
  const { agentId } = useParams();
  const numAgentId = Number(agentId);

  const classes = useStyles();
  const [currentOption, setCurrentOption] = useState<Maybe<IOption | IOptionInput>>(option);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [file, setFile] = useState<Maybe<File>>(null);

  const imageUploadUrlQuery = useQuery<GetImageOptionUploadUrlQueryResult>(getImageOptionUploadUrlQuery, {
    variables: {
      agentId: numAgentId,
      basename: file?.name,
    },
    skip: !file,
  });

  useEffect(() => {
    setCurrentOption(option);
  }, [option]);

  const saveChanges = async () => {
    if (!!currentOption) {
      const { tableData, __typename, intent, intentId, ...optionData } = currentOption as any;
      setSaveLoading(true);
      console.log({ ...optionData, intentId: intents.find(i => i.value === intent)?.id });
      await onSaveOption({ ...optionData, intentId: intentId || intents.find(i => i.value === intent)?.id });
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    if (!option && file) {
      setFile(null);
    }
  // eslint-disable-next-line
  }, [option]);

  useEffect(() => {
    if (!!file) {
      const url = imageUploadUrlQuery.data?.ChatbotService_imageOptionUploadUrl.url;

      if (!!url) {
        (async () => {
          try {
            await axios.put(url, file, {
              headers: {
                'Content-Type': file.type,
              },
            });

            const path = url.split('?')[0].split('/images/')[1];
            setCurrentOption(currentOption => ({ ...currentOption, imageUrl: path }) as any);
          } catch (e) {
            console.log(e);
            console.log(e.response);
          }

          setIsFileLoading(false);
        })();
      }
    }
  // eslint-disable-next-line
  }, [imageUploadUrlQuery.data]);

  const loading = isLoading || isFileLoading || saveLoading || imageUploadUrlQuery.loading;
  const optionTypes = Object.values(IOptionType);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setIsFileLoading(true);
    setFile(e.target.files?.[0]);
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
                      {(!file && !(currentOption as any)?.imageUrl) && 'Add Image'}
                      {(!!file || (!!(currentOption as any)?.imageUrl && (currentOption as any)?.imageUrl !== '')) && 'Replace Image'}
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
                  {!!file && (
                    <Box p={2}>
                      <img src={URL.createObjectURL(file)} alt="" style={{ maxWidth: 400, maxHeight: 400, objectFit: 'contain' }} />
                    </Box>
                  )}
                  {(!file && !!(currentOption as any)?.imageUrl && (currentOption as any)?.imageUrl !== '') && (
                    <Box p={2}>
                      <img src={(currentOption as any)?.imageUrl} alt="" style={{ maxWidth: 400, maxHeight: 400, objectFit: 'contain' }} />
                    </Box>
                  )}
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
