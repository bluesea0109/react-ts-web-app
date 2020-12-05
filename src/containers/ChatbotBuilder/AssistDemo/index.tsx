import { useQuery } from '@apollo/client';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import config from '../../../config';
import { getApiKeysQuery } from '../../Dashboard/WorkspaceSettings/gql';

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
  const classes = useStyles();
  const agentData = useQuery<IGetAgent>(GET_AGENT, {
    variables: { agentId: Number(agentId) },
  });

  const apiKeysQuery = useQuery(getApiKeysQuery, {
    variables: {
      workspaceId,
    },
    skip: !workspaceId,
  });

  const loadedKey = apiKeysQuery.data?.apiKeys?.[0]?.key ?? null;
  useEffect(() => {
    if (!apiKeysQuery.loading) {
      setApiKey(loadedKey);
    }
  }, [loadedKey, apiKeysQuery.loading]);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    if (apiKey && agentData && agentData.data) {
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
        })('${agentData.data.ChatbotService_agent.uname}', '${apiKey}', true, true)
        (window, document, 'script', '${config.bundleUrl}')
      `;
      document.body.appendChild(script);
    }

    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [apiKey, agentData]);

  useEffect(() => {
    return () => {
      document.getElementById('bavard-chatbox')?.remove();
      document.getElementById('bavard-chatbot-trigger')?.remove();
    };
  }, []);

  return <div className={classes.root} id="chatbot" />;
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
