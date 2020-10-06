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

import { CHATBOT_GET_AGENT } from '../../../common-gql-queries';
import { IAgent } from '../../../models/chatbot-service';
import ContentLoading from '../../ContentLoading';
import GradientPicker from '../../Utils/GradientPicker';
import { currentAgentConfig, currentWidgetSettings } from '../atoms';
import { updateBotSettingsMutation } from './gql';
import ImageUploader from './ImageUploader';
import { DEFAULT_WIDGET_SETTINGS, IWidgetSettings } from '@bavard/agent-config';

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

  const [config, setConfig] = useRecoilState(currentAgentConfig);
  const [widgetSettings, setWidgetSettings] = useRecoilState(currentWidgetSettings);

  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState<IWidgetSettings>({
    name: '',
    title: '',
    subtitle: '',
    logo: DEFAULT_WIDGET_SETTINGS.logo,
    avatar: DEFAULT_WIDGET_SETTINGS.avatar,
    primaryColor: DEFAULT_WIDGET_SETTINGS.primaryColor,
    primaryBg: DEFAULT_WIDGET_SETTINGS.primaryBg,
    widgetBg: DEFAULT_WIDGET_SETTINGS.widgetBg,
  });
  const [state, setState] = React.useState({
    mode: 'dev',
  });

  const agentsData = useQuery<{ ChatbotService_agent: IAgent }>(
    CHATBOT_GET_AGENT,
    {
      variables: { agentId: numAgentId },
      onCompleted: (data) => {
        setConfig(AgentConfig.fromJsonObj(data.ChatbotService_agent.config));
        setWidgetSettings(data.ChatbotService_agent.widgetSettings);
      },
    },
  );

  const agentUname = config?.toJsonObj()?.uname;

  const [updateBotSettings, updateBotSettingsMutationData] = useMutation(
    updateBotSettingsMutation,
  );

  const updatedSettings = widgetSettings;

  useEffect(() => {
    if (!!updatedSettings && !!updatedSettings.name) {
      setSettings({
        ...updatedSettings,
      });
    }

    // eslint-disable-next-line
  }, [updatedSettings]);

  const updateSettings = (field: keyof IWidgetSettings, value: any) =>
    setSettings({ ...settings, [field]: value });

  const onUpdateSettingsClicked = async () => {
    let { avatar, logo } = settings;

    if (avatar && avatar.indexOf('https://') !== -1) {
      avatar = avatar.split('?')[0].split('/bot-icons/')[1];
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
            logo,
            avatar,
          },
        },
      });
      const result = await agentsData.refetch();
      setWidgetSettings(result?.data?.ChatbotService_agent.widgetSettings);
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
              currentImage={settings.avatar}
              label="Widget Avatar"
              onImageUpload={(url: string) => updateSettings('avatar', url)}
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
