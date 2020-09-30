import { useQuery } from '@apollo/client';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import config from '../../../config';
import ContentLoading from '../../ContentLoading';
import { getApiKeysQuery } from '../../Dashboard/ProjectSettings/gql';

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
  const { agentId, projectId } = useParams();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const classes = useStyles();
  const [isActive, setIsActive] = useState(true);
  const [isDebug, setIsDebug] = useState(false);
  const [error, setError] = useState<any>(null);
  const iframe = useRef<HTMLIFrameElement | null>(null);
  const agentData = useQuery<IGetAgent>(GET_AGENT, { variables: { agentId: Number(agentId) } });

  const apiKeysQuery = useQuery(getApiKeysQuery, {
    variables: {
      projectId,
    },
    skip: !projectId,
  });

  const loadedKey = apiKeysQuery.data?.apiKey.key ?? null;
  console.log('when - ', apiKey);

  useEffect(() => {
    if (!apiKeysQuery.loading) {
      setApiKey(loadedKey);
    }
  }, [loadedKey, apiKeysQuery.loading]);

  const onMessage = useCallback((e: any) => {
    console.log('onMessage: ', e.data.hasOwnProperty('isError') && e.data?.isError);
    if (e.data.hasOwnProperty('isWidgetActive')) {
      setIsActive(e.data.isWidgetActive);
    } else if (e.data.hasOwnProperty('isError') && e.data?.isError) {
      setError(e.data);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const parentUrl = window.location.href;
      const url = new URL(parentUrl);
      const host = url.hostname;
      setIsDebug([
        'localhost',
        'bavard-ai-dev.web.app',
        'bavard-chatbot.web.app',
      ].includes(host));
    })();

    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  // eslint-disable-next-line
  }, []);

  if (agentData.loading) {
    return <ContentLoading/>;
  }

  const onIframeLoad = () => {
    console.log('iframe loaded', agentId, apiKey);

    iframe.current?.contentWindow?.postMessage({
      uname: agentData.data?.ChatbotService_agent.uname,
      apiKey,
      isWidgetActive: true,
    }, '*');
  };
  console.log('First render ', apiKey, agentId);
  return (
    <div
      className={classes.root}
      id="chatbot"
    >
      {(!!(apiKey && !!agentId) && (
        <iframe
          title="chatbot"
          src={config.chatbotUrl}
          ref={ref => iframe.current = ref}
          onLoad={onIframeLoad}
          style={{
            border: 'none',
            display: !!error ? 'none' : 'block',
            height: isActive ? '80%' : 76,
            width: isActive ? (isDebug ? 900 : 450) : 76,
            position: 'fixed',
            top: 'auto',
            left: 'auto',
            bottom: '24px',
            right: !isActive ? '24px' : 0,
            visibility: 'visible',
            zIndex: 2147483647,
            maxHeight: '100vh',
            maxWidth: '100vw',
            transition: 'none 0s ease 0s',
            background: 'none transparent',
            opacity: '1',
            pointerEvents: 'auto',
            touchAction: 'auto',
          }}
        />
      ))}
      {!!error && (
        <Typography
          variant="h6"
          color="error"
          style={{ fontWeight: 'bold', textAlign: 'center' }}
        >
          Error {error.code}: {error.message}
        </Typography>
      )}
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
