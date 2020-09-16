import { useMutation } from '@apollo/client';
import { AgentConfig, IAgentConfig } from '@bavard/agent-config';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import _ from 'lodash';
import React, { useState } from 'react';

import { readAgentZipfile } from '../../../utils/archive';
import ImageUploader from './ImageUploader';

import { useSnackbar } from 'notistack';
import {
  CHATBOT_CREATE_AGENT,
  CHATBOT_GET_AGENTS,
  CHATBOT_UPDATE_AGENT,
} from '../../../common-gql-queries';
import ContentLoading from '../../ContentLoading';
import { ICreateAgentMutationResult } from './types';

interface IProps {
  uname: string;
  buttonsDisabled: boolean;
  agentId?: number;
  projectId: string;
  onSuccess?: () => void;
  onError?: () => void;
  onCancel?: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    alert: {
      'word-break': 'break-word',
      margin: theme.spacing(1),
    },
    uploadButton: {
      margin: theme.spacing(1),
    },
    linearProg: {
      width: 190,
      marginTop: theme.spacing(1),
    },
  }),
);

interface IEnqueuedImgFile {
  uniqueId: string;
  type: 'uro-images' | 'bot-icons';
  file: File;
  status: 'queued' | 'uploading' | 'completed';
}

function UploadDataDialog({
  uname,
  buttonsDisabled,
  agentId,
  projectId,
}: IProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [completed, setCompleted] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  // const [config, setConfig] = useRecoilState(currentAgentConfig);
  const [enqueuedImgs, setEnqueuedImgs] = useState<IEnqueuedImgFile[]>([]);
  const [lastUpdated, setUpdated] = useState(Date.now());

  const [createAgent] = useMutation<ICreateAgentMutationResult>(
    CHATBOT_CREATE_AGENT,
    {
      refetchQueries: [{ query: CHATBOT_GET_AGENTS, variables: { projectId } }],
      awaitRefetchQueries: true,
    },
  );
  const [updateAgent, updateAgentData] = useMutation(CHATBOT_UPDATE_AGENT, {
    refetchQueries: [{ query: CHATBOT_GET_AGENTS, variables: { projectId } }],
    awaitRefetchQueries: true,
  });

  const [currAgentId, setAgentId] = useState(agentId);

  const handleClose = () => {
    onCancel();
  };

  const onCancel = () => {
    setAgentId(undefined);
    setOpen(false);
    setError(undefined);
    setLoading(false);
    setCompleted(false);
  };

  const ensureAgentExists = async (
    config?: IAgentConfig,
  ): Promise<number | undefined> => {
    setLoading(true);
    console.log('CONFIG: ', config);
    try {
      const agent = await createAgent({
        variables: {
          projectId,
          uname,
        },
      });
      setLoading(false);

      if (agent.data?.ChatbotService_createAgent.id) {
        setAgentId(agent.data?.ChatbotService_createAgent.id);
        enqueueSnackbar(`Agent ${uname} created`, { variant: 'success' });
        return agent.data?.ChatbotService_createAgent.id;
      }
      if (agent.errors?.length) {
        throw new Error(JSON.stringify(agent.errors));
      }
    } catch (e) {
      enqueueSnackbar(JSON.stringify(e).slice(0, 300), { variant: 'error' });
      setError(JSON.stringify(e));
      setLoading(false);
    }
  };

  const enqueuedImgForUpload = async (img: IEnqueuedImgFile) => {
    const imgs = enqueuedImgs;
    imgs.push(img);

    setEnqueuedImgs(imgs);
    setUpdated(Date.now());
  };

  const dequeueImgForUpload = async (uniqueId: string) => {
    let imgs = enqueuedImgs;
    console.log('IMGS BEFORE ', imgs);
    imgs = _.reject(imgs, (img) => {
      return img.uniqueId === uniqueId;
    });
    console.log('IMGS AFTER ', imgs);

    setEnqueuedImgs(imgs);
    setUpdated(Date.now());
  };

  const processJsonData = async (json: IAgentConfig) => {
    console.log(json);

    json.uname = uname;
    json.projectId = projectId;

    let uploadingAgentId = currAgentId;
    if (!uploadingAgentId) {
      console.log('Creating AGENT', projectId, uname, json);
      uploadingAgentId = await ensureAgentExists(json);
    }

    console.log({ uploadingAgentId });
    await updateAgent({
      variables: {
        agentId: uploadingAgentId,
        config: json,
      },
    });

    setCompleted(true);
  };

  const uploadImage = async (
    imgFile: File,
    type: 'uro-images' | 'bot-icons',
  ) => {
    // let url: string | undefined;

    console.log('UPLOAD IMG: ', imgFile, type);

    enqueuedImgForUpload({
      uniqueId: `${type}_${imgFile.name}`,
      file: imgFile,
      type,
      status: 'queued',
    });

    // if (type === 'uro-images') {
    //   addToEnqueuedImgs({
    //     file: imgFile,
    //     type
    //   });
    // const signedUrl:
    //   | ApolloQueryResult<IGetImageUploadSignedUrlQueryResult>
    //   | undefined = await this.props.client?.query({
    //   query: getSignedImgUploadUrlQuery,
    //   variables: {
    //     agentId: this.state.agentId,
    //     basename: imgFile.name,
    //   },
    // });

    // url = signedUrl?.data?.ChatbotService_imageOptionUploadUrl.url;
    //   console.log('URO IMAGE ', imgFile);
    // } else if (type === 'bot-icons') {
    // const signedUrl:
    //   | ApolloQueryResult<IBotIconUploadUrlQueryResult>
    //   | undefined = await this.props.client?.query({
    //   query: botIconUploadQuery,
    //   variables: {
    //     agentId: this.state.agentId,
    //     basename: imgFile.name,
    //   },
    // });

    // url = signedUrl?.data?.ChatbotService_botIconUploadUrl.url;
    //   console.log('BOT ICON ', imgFile);
    // }

    // if (!url) {
    // this.addToErrors(
    //   `Error in uploading Image: ${imgFile.name}`,
    //   `Failed to get signed upload url`,
    // );
    //   return;
    // }

    // try {
    //   await uploadFileWithFetch(imgFile, url, 'PUT');
    // } catch (e) {
    //   this.addToErrors(
    //     `Error in uploading Image: ${imgFile.name}`,
    //     JSON.stringify(e),
    //   );
    // }
  };

  const handleZipFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(true);
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    const zipContents = await readAgentZipfile(file);
    // JSON config file
    if (zipContents.agentConfig) {
      const json = JSON.parse(zipContents.agentConfig);
      console.log('JSON ', json);
      const agentConfig = AgentConfig.fromJsonObj(json.config);
      console.log({ agentConfig });
      await processJsonData(agentConfig.toJsonObj());
    }

    // URO Images
    if (zipContents.uroImages.length >= 1) {
      // let fileNum = 1;
      // setStepStatus('URO Images', 'importing');
      for (const img of zipContents.uroImages) {
        await uploadImage(img, 'uro-images');
        // setStepStatus(
        //   'URO Images',
        //   'importing',
        //   Math.ceil((fileNum * 100) / zipContents.uroImages.length)
        // );
        // fileNum++;
      }
      // setStepStatus('URO Images', 'completed');
    } else {
      // setStepStatus('URO Images', 'completed');
    }
    // Bot Icons
    if (zipContents.botIcons.length >= 1) {
      // setStepStatus('Bot Icons', 'importing');
      // let fileNum = 1;
      for (const img of zipContents.botIcons) {
        await uploadImage(img, 'bot-icons');
        // setStepStatus(
        //   'Bot Icons',
        //   'importing',
        //   Math.ceil((fileNum * 100) / zipContents.uroImages.length)
        // );
        // fileNum++;
      }
      // setStepStatus('Bot Icons', 'completed');
    } else {
      // setStepStatus('Bot Icons', 'completed');
    }

    // if (state.error.length >= 1) {
    //   props.onError?.();
    // } else {
    //   props.onSuccess?.();
    // }
  };

  const handleJsonFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(true);

    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    const reader = new FileReader();
    const json = await new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(reader.result);
      };
      reader.readAsText(file, 'utf-8');
    });

    const agentConfig = AgentConfig.fromJsonObj(JSON.parse(json));

    processJsonData(agentConfig.toJsonObj());

    setOpen(false);
  };

  let dialogContent = (
    <DialogContent>
      Uploading Agent
      <ContentLoading />
    </DialogContent>
  );

  if (currAgentId) {
    dialogContent = (
      <DialogContent>
        <Typography variant="subtitle2">{lastUpdated}</Typography>
        <Grid container={true}>
          <Grid item={true} sm={12}>
            {enqueuedImgs.map((img, index) => {
              return (
                <ImageUploader
                  key={index}
                  type={img.type}
                  file={img.file}
                  uniqueId={img.uniqueId}
                  agentId={currAgentId}
                  onSuccess={dequeueImgForUpload}
                />
              );
            })}
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" className={classes.alert}>
            <Typography variant="subtitle1" color="error">
              An error occured
            </Typography>
            {error}
          </Alert>
        )}
      </DialogContent>
    );
  }

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle>{'Upload Agent Data'}</DialogTitle>
        {dialogContent}
        <DialogActions>
          {completed ? (
            <Button variant="contained" color="secondary" onClick={handleClose}>
              {'Close'}
            </Button>
          ) : (
            <Button color="secondary" onClick={onCancel} disabled={loading}>
              {'Cancel'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        component="label"
        className={classes.uploadButton}
        disabled={buttonsDisabled || loading}
        color="primary">
        {'Upload JSON File'}
        <input
          name="json"
          id="json"
          accept="application/JSON"
          type="file"
          style={{ display: 'none' }}
          multiple={false}
          onChange={handleJsonFile}
        />
      </Button>
      <Button
        variant="contained"
        component="label"
        className={classes.uploadButton}
        disabled={buttonsDisabled || loading}
        color="primary">
        Upload Zip File
        <input
          name="zipfile"
          id="zipfile"
          accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
          type="file"
          style={{ display: 'none' }}
          multiple={false}
          onChange={handleZipFile}
        />
      </Button>
      {loading && <ContentLoading />}
    </React.Fragment>
  );
}

export default UploadDataDialog;
