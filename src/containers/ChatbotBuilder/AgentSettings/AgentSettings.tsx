import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@bavard/react-components';
import { AgentConfig } from '@bavard/agent-config';
import { Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab/';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { DEFAULT_WIDGET_SETTINGS, IWidgetSettings } from '@bavard/agent-config';
import { CHATBOT_GET_AGENT } from '../../../common-gql-queries';
import { IAgent } from '../../../models/chatbot-service';
import { currentAgentConfig, currentWidgetSettings } from '../atoms';
import { getBotSettingsQuery, updateBotSettingsMutation } from './gql';

import { Avatars } from './Avatars';
import { Description } from './Description';
import { ColorPalett } from './Palets';
import ApolloErrorPage from '../../ApolloErrorPage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    card: {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(2),
    },
    spanOfPanel: {
      width: '80%',
      marginLeft: '10%',
    },
    panel: {
      backgroundColor: 'white',
      padding: '60px',
    },
    submitBtn: {
      display: 'flex',
      justifyContent: 'center',
    },
    pageTitle: {
      marginBottom: '24px',
      marginTop: '50px',
      fontSize: '26px',
    },
  }),
);

const AgentSettings = () => {
  const classes = useStyles();
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);

  const [config, setConfig] = useRecoilState(currentAgentConfig);
  const [widgetSettings, setWidgetSettings] = useRecoilState(
    currentWidgetSettings,
  );

  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState<IWidgetSettings>({
    ...DEFAULT_WIDGET_SETTINGS,
    title: '',
    subtitle: '',
  });
  const [mode, setMode] = useState<string>('dev');

  const agentUname = config?.toJsonObj()?.uname;

  const [
    updateBotSettings,
    { loading: updateBotSettingsLoading, error: updateBotSettingsError },
  ] = useMutation(updateBotSettingsMutation);

  const {
    error: agentsError,
    loading: agentsLoading,
    refetch: agentsRefetch,
  } = useQuery<{ ChatbotService_agent: IAgent }>(CHATBOT_GET_AGENT, {
    variables: { agentId },
    onCompleted: (data) => {
      setConfig(AgentConfig.fromJsonObj(data.ChatbotService_agent.config));
    },
  });

  const {
    error: widgetSettingsError,
    refetch: widgetSettingsRefetch,
  } = useQuery<{
    ChatbotService_widgetSettings: IWidgetSettings;
  }>(getBotSettingsQuery, {
    skip: !agentUname,
    variables: {
      uname: agentUname,
      dev: mode === 'dev',
    },
    onCompleted: (data) => {
      setWidgetSettings(data.ChatbotService_widgetSettings);
    },
  });

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
      await agentsRefetch();
      const result = await widgetSettingsRefetch();
      setWidgetSettings(result?.data?.ChatbotService_widgetSettings);
    } catch (e) {
      enqueueSnackbar('An error occurred while updating settings', {
        variant: 'error',
      });
    }
  };

  const commonError =
    agentsError || widgetSettingsError || updateBotSettingsError;
  if (commonError) {
    return <ApolloErrorPage error={commonError} />;
  }

  const loading = agentsLoading || updateBotSettingsLoading;

  return (
    <Grid className={classes.spanOfPanel}>
      <Grid className={classes.pageTitle}>Assistant Design Settings</Grid>
      <Grid style={{ marginBottom: '20px' }}>
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
      </Grid>

      <Grid className={classes.panel}>
        <Grid>
          <Avatars
            mode={mode}
            loading={loading}
            settings={settings}
            updateSettings={updateSettings}
          />
          <Description
            mode={mode}
            loading={loading}
            settings={settings}
            updateSettings={updateSettings}
          />
          <ColorPalett
            mode={mode}
            loading={loading}
            settings={settings}
            updateSettings={updateSettings}
          />
        </Grid>
        <Grid className={classes.submitBtn}>
          {mode === 'dev' && (
            <Button
              title="Update Settings"
              variant="contained"
              color="primary"
              disabled={loading}
              style={{ marginTop: '25px', marginBottom: '80px' }}
              onClick={onUpdateSettingsClicked}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AgentSettings;
