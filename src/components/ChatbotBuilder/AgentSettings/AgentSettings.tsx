import { useMutation, useQuery } from '@apollo/client';
import { AGENT_SETTINGS_DEFAULTS } from '@bavard/common';
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab/';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { AlphaPicker, TwitterPicker } from 'react-color';
import { useParams } from 'react-router-dom';
import { CHATBOT_GET_AGENT } from '../../../common-gql-queries';
import { IAgent } from '../../../models/chatbot-service';
import GradientPicker from '../../Utils/GradientPicker';
import { getBotSettingsQuery, updateBotSettingsMutation } from './gql';
import ImageUploader from './ImageUploader';
import { BotSettings } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    card: {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(2),
    },
  }),
);

const AgentSettings = () => {
  const classes = useStyles();
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState<BotSettings>({
    name: '',
    title: '',
    subtitle: '',
    icon: AGENT_SETTINGS_DEFAULTS.icon,
    primaryColor: AGENT_SETTINGS_DEFAULTS.primaryColor,
    primaryBg: AGENT_SETTINGS_DEFAULTS.primaryBg,
    widgetBg: AGENT_SETTINGS_DEFAULTS.widgetBg,
  });
  const [state, setState] = React.useState({
    mode: 'dev',
  });

  const agentsData = useQuery<{ ChatbotService_agent: IAgent }>(
    CHATBOT_GET_AGENT,
    { variables: { agentId: numAgentId } },
  );

  const agentUname = agentsData.data?.ChatbotService_agent.uname;

  const botSettings = useQuery<{ ChatbotService_botSettings: any }>(
    getBotSettingsQuery,
    {
      variables: {
        uname: agentUname,
        dev: state.mode === 'dev',
      },
    },
  );

  const [updateBotSettings, updateBotSettingsMutationData] = useMutation(
    updateBotSettingsMutation,
    {
      refetchQueries: [
        { query: getBotSettingsQuery, variables: { uname: agentUname } },
      ],
      awaitRefetchQueries: true,
    },
  );

  const updatedSettings = botSettings.data?.ChatbotService_botSettings;

  useEffect(() => {
    if (!!updatedSettings && !!updatedSettings.name) {
      setSettings({
        primaryColor: AGENT_SETTINGS_DEFAULTS.primaryColor,
        primaryBg: AGENT_SETTINGS_DEFAULTS.primaryColor,
        widgetBg: AGENT_SETTINGS_DEFAULTS.widgetBg,
        icon: AGENT_SETTINGS_DEFAULTS.icon,
        ...updatedSettings,
      });
    }

    // eslint-disable-next-line
  }, [updatedSettings]);

  const updateSettings = (field: keyof BotSettings, value: any) =>
    setSettings({ ...settings, [field]: value });

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
      botSettings.refetch();
    } catch (e) {
      enqueueSnackbar('An error occurred while updating settings', {
        variant: 'error',
      });
    }
  };

  const loading = botSettings.loading || updateBotSettingsMutationData.loading;

  return (
    <Grid container={true} spacing={2} className={classes.root}>
      <Grid item={true} xs={12}>
        <Typography variant="h6">Agent Settings</Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          mt={2}
          mb={2}>
          <ToggleButtonGroup
            value={state.mode === 'dev' ? 'left' : 'right'}
            exclusive={true}
            size="small"
            onChange={(event, newAlignment) => {
              setState({
                ...state,
                mode: newAlignment === 'left' ? 'dev' : 'published',
              });
            }}
            aria-label="text alignment">
            <ToggleButton
              disabled={loading}
              size="small"
              value="left"
              aria-label="left aligned">
              DEV
            </ToggleButton>
            <ToggleButton
              disabled={loading}
              size="small"
              value="right"
              aria-label="right aligned">
              PUBLISHED
            </ToggleButton>
          </ToggleButtonGroup>
          {state.mode === 'dev' && (
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              onClick={onUpdateSettingsClicked}>
              Update Settings
            </Button>
          )}
        </Box>
        <Divider />
      </Grid>

      <Grid item={true} xs={6}>
        <Box mt={2} mb={2}>
          <TextField
            label="Agent Name"
            disabled={loading || state.mode === 'published'}
            fullWidth={true}
            variant="outlined"
            value={settings.name}
            onChange={(e) => updateSettings('name', e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Greeting Title"
            disabled={loading || state.mode === 'published'}
            fullWidth={true}
            variant="outlined"
            value={settings.title}
            onChange={(e) => updateSettings('title', e.target.value)}
          />
        </Box>

        <TextField
          label="Greeting Subtitle"
          disabled={loading || state.mode === 'published'}
          fullWidth={true}
          multiline={true}
          variant="outlined"
          rows={4}
          value={settings.subtitle}
          onChange={(e) => updateSettings('subtitle', e.target.value)}
        />
      </Grid>

      <Grid item={true} xs={6}>
        <Grid container={true} spacing={2}>
          <Grid item={true} xs={6}>
            <ImageUploader
              isLoading={loading || state.mode === 'published'}
              currentImage={settings.icon}
              label="Widget Avatar"
              onImageUpload={(url: string) => updateSettings('icon', url)}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <ImageUploader
              isLoading={loading || state.mode === 'published'}
              currentImage={settings.logo}
              label="Brand Logo"
              onImageUpload={(url: string) => updateSettings('logo', url)}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item={true} xs={4}>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Typography variant="subtitle1">Widget Primary Color</Typography>
          <Box
            mt={2}
            width="90%"
            height={100}
            style={{
              backgroundColor: `rgba(${settings.primaryColor.r}, ${settings.primaryColor.g}, ${settings.primaryColor.b}, ${settings.primaryColor.a})`,
            }}
          />
          <Box mt={5} mb={1} mx="auto">
            {state.mode === 'dev' && (
              <TwitterPicker
                triangle="hide"
                color={settings.primaryColor}
                onChange={(color) => updateSettings('primaryColor', color.rgb)}
              />
            )}
          </Box>
          <Box mt={4} mb={1} mx="auto">
            {state.mode === 'dev' && (
              <AlphaPicker
                color={settings.primaryColor}
                onChange={(color) => updateSettings('primaryColor', color.rgb)}
              />
            )}
          </Box>
        </Box>
      </Grid>

      <Grid item={true} xs={4}>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Typography variant="subtitle1">Widget Primary Background</Typography>
          <Box
            mt={2}
            width="90%"
            height={100}
            style={{
              backgroundColor: `rgba(${settings.primaryBg.r}, ${settings.primaryBg.g}, ${settings.primaryBg.b}, ${settings.primaryBg.a})`,
            }}
          />
          <Box mt={5} mb={1} mx="auto">
            {state.mode === 'dev' && (
              <TwitterPicker
                triangle="hide"
                color={settings.primaryBg}
                onChange={(color) => updateSettings('primaryBg', color.rgb)}
              />
            )}
          </Box>
          <Box mt={4} mb={1} mx="auto">
            {state.mode === 'dev' && (
              <AlphaPicker
                color={settings.primaryBg}
                onChange={(color) => updateSettings('primaryBg', color.rgb)}
              />
            )}
          </Box>
        </Box>
      </Grid>

      <Grid item={true} xs={4}>
        <GradientPicker
          defaultValue={updatedSettings?.widgetBg}
          label="Widget Background Color"
          onChange={(gradient) => updateSettings('widgetBg', gradient)}
        />
      </Grid>

      <Grid xs={12} item={true}>
        <Divider />
        <Box mt={4} mb={4} width="90%" display="flex" justifyContent="center">
          {state.mode === 'dev' && (
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              onClick={onUpdateSettingsClicked}>
              Update Settings
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AgentSettings;
