import { useMutation, useQuery } from '@apollo/client';
import { AgentConfig } from '@bavard/agent-config';
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
import { useRecoilState } from 'recoil';

import { DEFAULT_WIDGET_SETTINGS, IWidgetSettings } from '@bavard/agent-config';
import { CHATBOT_GET_AGENT } from '../../../common-gql-queries';
import { IAgent } from '../../../models/chatbot-service';
import ContentLoading from '../../ContentLoading';
import GradientPicker from '../../Utils/GradientPicker';
import { currentAgentConfig, currentWidgetSettings } from '../atoms';
import { getBotSettingsQuery, updateBotSettingsMutation } from './gql';
import ImageUploader from './ImageUploader';

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
  const { agentId } = useParams<{ agentId: string }>();

  const [config, setConfig] = useRecoilState(currentAgentConfig);
  const [widgetSettings, setWidgetSettings] = useRecoilState(currentWidgetSettings);

  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState<IWidgetSettings>({
    ...DEFAULT_WIDGET_SETTINGS,
    title: '',
    subtitle: '',
  });
  const [mode, setMode] = useState<string>('dev');

  const agentUname = config?.toJsonObj()?.uname;

  const [updateBotSettings, updateBotSettingsMutationData] = useMutation(updateBotSettingsMutation);

  const agentsData = useQuery<{ ChatbotService_agent: IAgent }>(
    CHATBOT_GET_AGENT,
    {
      variables: { agentId: Number(agentId) },
      onCompleted: (data) => {
        setConfig(AgentConfig.fromJsonObj(data.ChatbotService_agent.config));
      },
    },
  );

  const widgetSettingsData = useQuery<{ ChatbotService_widgetSettings: IWidgetSettings }>(
    getBotSettingsQuery,
    {
      skip: !agentUname,
      variables: {
        uname: agentUname,
        dev: mode === 'dev',
      },
      onCompleted: (data) => {
        setWidgetSettings(data.ChatbotService_widgetSettings);
      },
    },
  );

  useEffect(() => {
    if (!!widgetSettings && !!widgetSettings.name) {
      setSettings({
        ...widgetSettings,
      });
    }
  }, [widgetSettings]);

  const updateSettings = (field: keyof IWidgetSettings, value: any) =>
    setSettings({ ...settings, [field]: value });

  const onUpdateSettingsClicked = async () => {
    const { logo, logoUrl, avatar, avatarUrl } = settings;
    try {
      await updateBotSettings({
        variables: {
          uname: agentUname,
          settings: {
            ...settings,
            logo,
            avatar,
            logoUrl,
            avatarUrl,
          },
        },
      });
      await agentsData.refetch();
      const result = await widgetSettingsData.refetch();
      setWidgetSettings(result?.data?.ChatbotService_widgetSettings);
    } catch (e) {
      enqueueSnackbar('An error occurred while updating settings', {
        variant: 'error',
      });
    }
  };

  const loading = agentsData.loading || updateBotSettingsMutationData.loading;

  return (
    <Grid container={true} spacing={2} className={classes.root}>
      <Grid item={true} xs={12}>
        <Typography variant="h6">Agent Settings</Typography>
        {loading && <ContentLoading />}
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          mt={2}
          mb={2}>
          <ToggleButtonGroup
            value={mode === 'dev' ? 'left' : 'right'}
            exclusive={true}
            size="small"
            onChange={(_, newAlignment) => {
              setMode(newAlignment === 'left' ? 'dev' : 'published');
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
          {mode === 'dev' && (
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
            disabled={loading || mode === 'published'}
            fullWidth={true}
            variant="outlined"
            value={settings.name}
            onChange={(e) => updateSettings('name', e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Greeting Title"
            disabled={loading || mode === 'published'}
            fullWidth={true}
            variant="outlined"
            value={settings.title}
            onChange={(e) => updateSettings('title', e.target.value)}
          />
        </Box>

        <TextField
          label="Greeting Subtitle"
          disabled={loading || mode === 'published'}
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
              isLoading={loading || mode === 'published'}
              currentImage={settings.avatarUrl}
              label="Widget Avatar"
              onImageUpload={(url: string) => updateSettings('avatar', url)}
              iconType="AVATAR"
            />
          </Grid>
          <Grid item={true} xs={6}>
            <ImageUploader
              isLoading={loading || mode === 'published'}
              currentImage={settings.logoUrl}
              label="Brand Logo"
              onImageUpload={(url: string) => updateSettings('logo', url)}
              iconType="LOGO"
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
            {mode === 'dev' && (
              <TwitterPicker
                triangle="hide"
                color={settings.primaryColor}
                onChange={(color) => updateSettings('primaryColor', color.rgb)}
              />
            )}
          </Box>
          <Box mt={4} mb={1} mx="auto">
            {mode === 'dev' && (
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
            {mode === 'dev' && (
              <TwitterPicker
                triangle="hide"
                color={settings.primaryBg}
                onChange={(color) => updateSettings('primaryBg', color.rgb)}
              />
            )}
          </Box>
          <Box mt={4} mb={1} mx="auto">
            {mode === 'dev' && (
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
          defaultValue={widgetSettings?.widgetBg}
          label="Widget Background Color"
          onChange={(gradient) => updateSettings('widgetBg', gradient)}
        />
      </Grid>

      <Grid xs={12} item={true}>
        <Divider />
        <Box mt={4} mb={4} width="90%" display="flex" justifyContent="center">
          {mode === 'dev' && (
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
