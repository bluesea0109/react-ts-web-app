import { useQuery } from '@apollo/client';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab/';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import config from '../../../config';
import { getApiKeysQuery } from '../../Dashboard/WorkspaceSettings/gql';
import ApolloErrorPage from '../../ApolloErrorPage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      overflow: 'auto',
      padding: theme.spacing(2),
    },
  }),
);

export default function ChatWithAgent() {
  const { agentId, workspaceId } = useParams<{
    agentId: string;
    workspaceId: string;
  }>();

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [mode, setMode] = useState('PREVIEW');
  const classes = useStyles();
  const { data: agentData, error: agentError } = useQuery<IGetAgent>(
    GET_AGENT,
    {
      variables: { agentId: Number(agentId) },
    },
  );

  const {
    data: apiKeysData,
    error: apiKeysError,
    loading: apiKeysLoading,
  } = useQuery(getApiKeysQuery, {
    variables: {
      workspaceId,
    },
    skip: !workspaceId,
  });

  const loadedKey = apiKeysData?.apiKeys?.[0]?.key ?? null;
  useEffect(() => {
    if (!apiKeysLoading) {
      setApiKey(loadedKey);
    }
  }, [loadedKey, apiKeysLoading]);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    if (apiKey && agentData) {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = `
        (function (uname, apiKey, debug, dev) {
          return function (i, s, o, g, r, a, m) {
            a = s.createElement(o), m = s.querySelector("body");
            a.onload = function () { i['loadBavard']({uname, apiKey, debug, dev}) };
            a.async = 1; a.src = g; m.appendChild(a), a.type = "application/javascript";
          }
        })('${agentData.ChatbotService_agent.uname}', '${apiKey}', true, ${
        mode === 'PREVIEW'
      })
        (window, document, 'script', '${config.bundleUrl}')
      `;
      document.body.appendChild(script);
    }

    return () => {
      (window as any).unloadBavard?.();
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [apiKey, agentData, mode]);

  useEffect(() => {
    return () => {
      document.getElementById('bavard-chatbox')?.remove();
      document.getElementById('bavard-chatbot-trigger')?.remove();
    };
  }, []);

  if (agentError || apiKeysError) {
    return <ApolloErrorPage error={agentError || apiKeysError} />;
  }

  return (
    <div className={classes.root} id="chatbot">
      <ToggleButtonGroup
        value={mode === 'PREVIEW' ? 'left' : 'right'}
        exclusive={true}
        size="small"
        onChange={(_, newAlignment) => {
          setMode(newAlignment === 'left' ? 'PREVIEW' : 'PUBLISHED');
        }}
        aria-label="text alignment">
        <ToggleButton size="small" value="left" aria-label="left aligned">
          PREVIEW
        </ToggleButton>
        <ToggleButton size="small" value="right" aria-label="right aligned">
          PUBLISHED
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

interface IGetAgent {
  ChatbotService_agent: {
    uname: string;
  };
}

const GET_AGENT = gql`
  query($agentId: Int!) {
    ChatbotService_agent(agentId: $agentId) {
      uname
    }
  }
`;
