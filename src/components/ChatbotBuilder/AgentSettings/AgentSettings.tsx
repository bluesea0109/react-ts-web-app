import { useMutation, useQuery } from '@apollo/client';
import { Box, Grid, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import gql from 'graphql-tag';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CHATBOT_GET_AGENT } from '../../../common-gql-queries';
import { IAgent } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { getBotSettingsQuery, updateBotSettingsMutation } from './gql';
import { BotSettings } from './types';

const AgentSettings = () => {
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState<BotSettings>({
    name: '',
    icon: undefined,
  });

  const [isFileLoading, setIsFileLoading] = useState(false);
  const [file, setFile] = useState<Maybe<File>>(null);

  const agentsData = useQuery<{ ChatbotService_agent: IAgent }>(CHATBOT_GET_AGENT, { variables: { agentId: numAgentId } });

  const agentUname = agentsData.data?.ChatbotService_agent.uname;

  const botSettings = useQuery<{ ChatbotService_botSettings: any }>(getBotSettingsQuery, {
    variables: {
      uname: agentUname,
    },
    skip: !agentUname,
  });

  const imageUploadUrlQuery = useQuery<{ ChatbotService_botIconUploadUrl: { url: string } }>(gql`
      query($agentId: Int!, $basename: String!) {
          ChatbotService_botIconUploadUrl(agentId: $agentId, basename: $basename) {
              url
          }
      }
  `, {
    variables: {
      agentId: numAgentId,
      basename: file?.name,
    },
    skip: !file,
  });

  const [updateBotSettings, updateBotSettingsMutationData] = useMutation(updateBotSettingsMutation, {
    refetchQueries: [
      { query: getBotSettingsQuery, variables: { uname: agentUname }},
    ],
    awaitRefetchQueries: true,
  });

  const updatedSettings = botSettings.data?.ChatbotService_botSettings;

  useEffect(() => {
    if (!updatedSettings && file) {
      setFile(null);
    }

    if (!!updatedSettings && !!updatedSettings.name) {
      setSettings(updatedSettings);
    }

    // eslint-disable-next-line
  }, [updatedSettings]);

  useEffect(() => {
    if (!!file) {
      const url = imageUploadUrlQuery.data?.ChatbotService_botIconUploadUrl.url;

      if (!!url) {
        (async () => {
          try {
            await axios.put(url, file, {
              headers: {
                'Content-Type': file.type,
              },
            });

            const path = url.split('?')[0].split('/bot-icons/')[1];

            setSettings({ ...settings, icon: path });
          } catch (e) {
            console.log(e);
            console.log(e.response);
            enqueueSnackbar('An error occurred while uploading image', { variant: 'error' });
          }

          setIsFileLoading(false);
        })();
      }
    }
    // eslint-disable-next-line
  }, [imageUploadUrlQuery.data]);

  const updateSettings = (field: string, value: any) => setSettings({ ...settings, [field]: value });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setIsFileLoading(true);
    setFile(e.target.files?.[0]);
  };

  const onUpdateSettingsClicked = async () => {
    const { name } = settings;
    let { icon } = settings;

    if (icon && icon.indexOf('https://') !== -1) {
      icon = icon.split('?')[0].split('/bot-icons/')[1];
    }

    try {
      await updateBotSettings({
        variables: {
          uname: agentUname,
          settings: {
            name,
            icon,
          },
        },
      });
    } catch (e) {
      enqueueSnackbar('An error occurred while updating settings', { variant: 'error' });
    }
  };

  const loading = isFileLoading || imageUploadUrlQuery.loading || botSettings.loading || updateBotSettingsMutationData.loading;

  return (
    <Box py={4} px={2} width="100%">
      <Grid container={true}>
        <Grid item={true} xs={6}>
          <Box p={2}>
            <TextField
              label="Option Text"
              disabled={loading}
              fullWidth={true}
              multiline={true}
              variant="outlined"
              rows={4}
              value={settings.name}
              onChange={e => updateSettings('name', e.target.value)}
            />
          </Box>
        </Grid>
        <Grid item={true} xs={6}>
          <Box p={2}>
            <Button
              disabled={loading}
              variant="contained"
              component="label"
              style={{ padding: 6 }}>
              {!file && !settings.icon && 'Add Image'}
              {(!!file || (!!settings.icon && settings.icon !== '')) && 'Replace Image'}
              <input
                disabled={loading}
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
          {(!file && !!settings.icon && settings.icon !== '') && (
            <Box p={2}>
              <img src={settings.icon} alt="" style={{ maxWidth: 400, maxHeight: 400, objectFit: 'contain' }} />
            </Box>
          )}
        </Grid>
      </Grid>
      <Button disabled={loading} variant="outlined" onClick={onUpdateSettingsClicked}>Update Settings</Button>
    </Box>
  );
};

export default AgentSettings;
