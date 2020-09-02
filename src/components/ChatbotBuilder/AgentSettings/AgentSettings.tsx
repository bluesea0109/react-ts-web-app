import { useMutation, useQuery } from '@apollo/client';
import { Box, Grid, TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { AlphaPicker, TwitterPicker } from 'react-color';
import { useParams } from 'react-router-dom';
import { CHATBOT_GET_AGENT } from '../../../common-gql-queries';
import { IAgent } from '../../../models/chatbot-service';
import { getBotSettingsQuery, updateBotSettingsMutation } from './gql';
import ImageUploader from './ImageUploader';
import { BotSettings, ColorItem } from './types';

const DEFAULT_PRIMARY_COLOR: ColorItem = {
  r: 10,
  g: 91,
  b: 255,
  a: 1,
};

const DEFAULT_PRIMARY_BG: ColorItem = {
  r: 10,
  g: 103,
  b: 238,
  a: 1.00,
};

const AgentSettings = () => {
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState<BotSettings>({
    name: '',
    icon: undefined,
    primaryColor: DEFAULT_PRIMARY_COLOR,
    primaryBg: DEFAULT_PRIMARY_BG,
  });

  const agentsData = useQuery<{ ChatbotService_agent: IAgent }>(CHATBOT_GET_AGENT, { variables: { agentId: numAgentId } });

  const agentUname = agentsData.data?.ChatbotService_agent.uname;

  const botSettings = useQuery<{ ChatbotService_botSettings: any }>(getBotSettingsQuery, {
    variables: {
      uname: agentUname,
      dev: true,
    },
    skip: !agentUname,
  });

  const [updateBotSettings, updateBotSettingsMutationData] = useMutation(updateBotSettingsMutation, {
    refetchQueries: [
      { query: getBotSettingsQuery, variables: { uname: agentUname }},
    ],
    awaitRefetchQueries: true,
  });

  const updatedSettings = botSettings.data?.ChatbotService_botSettings;

  useEffect(() => {
    if (!!updatedSettings && !!updatedSettings.name) {
      setSettings({
        primaryColor: DEFAULT_PRIMARY_COLOR,
        primaryBg: DEFAULT_PRIMARY_BG,
        ...updatedSettings,
      });
    }

    // eslint-disable-next-line
  }, [updatedSettings]);

  const updateSettings = (field: keyof BotSettings, value: any) => setSettings({ ...settings, [field]: value });

  const onUpdateSettingsClicked = async () => {
    let { icon, logo } = settings;

    if (icon && icon.indexOf('https://') !== -1) {
      icon = icon.split('?')[0].split('/bot-icons/')[1];
    }

    if (logo && logo.indexOf('https://') !== -1) {
      logo = logo.split('?')[0].split('/bot-icons/')[1];
    }

    try {
      await updateBotSettings({
        variables: {
          uname: agentUname,
          settings: {
            ...settings,
            icon,
            logo,
          },
        },
      });
    } catch (e) {
      enqueueSnackbar('An error occurred while updating settings', { variant: 'error' });
    }
  };

  const loading = botSettings.loading || updateBotSettingsMutationData.loading;

  return (
    <Box py={4} px={2} width="100%">
      <Grid container={true}>
        <Grid item={true} xs={6}>
          <Box p={2}>
            <TextField
              label="Agent Name"
              disabled={loading}
              fullWidth={true}
              variant="outlined"
              value={settings.name}
              onChange={e => updateSettings('name', e.target.value)}
            />
          </Box>
        </Grid>
        <Grid item={true} xs={6}>
          <Box p={2}>
            <TextField
              label="Greeting Title"
              disabled={loading}
              fullWidth={true}
              variant="outlined"
              value={settings.title}
              onChange={e => updateSettings('title', e.target.value)}
            />
          </Box>
        </Grid>
        <Grid item={true} xs={6}>
          <Box p={2}>
            <TextField
              label="Greeting Subtitle"
              disabled={loading}
              fullWidth={true}
              multiline={true}
              variant="outlined"
              rows={4}
              value={settings.subtitle}
              onChange={e => updateSettings('subtitle', e.target.value)}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container={true}>
        <Grid item={true} xs={6}>
          <ImageUploader
            loading={loading}
            currentImage={settings.icon}
            label="Widget Avatar"
            onImageUpload={(url: string) => updateSettings('icon', url)}
          />
        </Grid>
        <Grid item={true} xs={6}>
          <ImageUploader
            loading={loading}
            currentImage={settings.logo}
            label="Brand Logo"
            onImageUpload={(url: string) => updateSettings('logo', url)}
          />
        </Grid>
        <Grid item={true} xs={6}>
          <Box p={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">Widget Primary Color</Typography>
            <Box mt={2} width="100%" height={100} style={{ backgroundColor: `rgba(${settings.primaryColor.r}, ${settings.primaryColor.g}, ${settings.primaryColor.b}, ${settings.primaryColor.a})`}} />
            <Box mt={5} mb={1} mx="auto">
              <TwitterPicker
                triangle="hide"
                color={settings.primaryColor}
                onChange={color => updateSettings('primaryColor', color.rgb)} />
            </Box>
            <Box mt={4} mb={1} mx="auto">
              <AlphaPicker
                color={settings.primaryColor}
                onChange={color => updateSettings('primaryColor', color.rgb)} />
            </Box>
          </Box>
        </Grid>
        <Grid item={true} xs={6}>
          <Box p={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">Widget Primary Background</Typography>
            <Box mt={2} width="100%" height={100} style={{ backgroundColor: `rgba(${settings.primaryBg.r}, ${settings.primaryBg.g}, ${settings.primaryBg.b}, ${settings.primaryBg.a})`}} />
            <Box mt={5} mb={1} mx="auto">
              <TwitterPicker
                triangle="hide"
                color={settings.primaryBg}
                onChange={color => updateSettings('primaryBg', color.rgb)} />
            </Box>
            <Box mt={4} mb={1} mx="auto">
              <AlphaPicker
                color={settings.primaryBg}
                onChange={color => updateSettings('primaryBg', color.rgb)} />
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box mt={4} width="100%" display="flex" justifyContent="center">
        <Button disabled={loading} variant="outlined" onClick={onUpdateSettingsClicked}>Update Settings</Button>
      </Box>
    </Box>
  );
};

export default AgentSettings;
