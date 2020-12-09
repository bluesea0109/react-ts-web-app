import { useQuery } from '@apollo/client';
import { Button } from '@bavard/react-components';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import gql from 'graphql-tag';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import config from '../../../config';
import ContentLoading from '../../ContentLoading';
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
  const classes = useStyles();
  const [isActive, setIsActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [iframeFirstOpened, setIFrameFirstOpened] = useState(true);
  const iframe = useRef<HTMLIFrameElement | null>(null);
  const {
    data: agentData,
    error: agentError,
    loading: agentLoading,
  } = useQuery<IGetAgent>(GET_AGENT, {
    variables: { agentId: Number(agentId) },
  });
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

  const loadedKey = apiKeysData?.apiKey.key ?? null;
  useEffect(() => {
    if (!apiKeysLoading) {
      setApiKey(loadedKey);
    }
  }, [loadedKey, apiKeysLoading]);

  const onMessage = useCallback((e: any) => {
    if (e.data.hasOwnProperty('loaded')) {
      setTimeout(() => setIsLoaded(true), 1200);
    }
  }, []);

  const toggleContentWindow = () => {
    setIsActive(!isActive);

    if (iframeFirstOpened) {
      iframe.current?.contentWindow?.postMessage(
        {
          iframeFirstOpened: true,
        },
        '*',
      );
      setIFrameFirstOpened(false);
    }
  };

  useEffect(() => {
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!apiKey) {
      return;
    }
    iframe.current?.contentWindow?.postMessage(
      {
        apiKey,
        uname: agentData?.ChatbotService_agent.uname,
        isActive: false,
        debug: true,
        dev: true,
      },
      '*',
    );
  }, [apiKey, agentData]);

  useEffect(() => {
    iframe.current?.contentWindow?.postMessage(
      {
        isActive,
      },
      '*',
    );
  }, [isActive]);

  const commonError = agentError || apiKeysError;
  if (commonError) {
    return <ApolloErrorPage error={commonError} />;
  }

  if (agentLoading || apiKeysLoading) {
    return <ContentLoading shrinked={true} />;
  }

  return (
    <div className={classes.root} id="chatbot">
      <iframe
        title="chatbot"
        src={config.chatbotUrl}
        ref={(ref) => (iframe.current = ref)}
        style={{
          border: 'none',
          display: isLoaded && isActive ? 'block' : 'none',
          height: isActive ? '100%' : 350,
          width: 550,
          position: 'fixed',
          top: 'auto',
          left: 'auto',
          bottom: 0,
          right: !isActive ? '24px' : '13px',
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

      <Button
        title={isActive ? 'Hide' : 'Show'}
        color="primary"
        variant="contained"
        disabled={!isLoaded}
        onClick={toggleContentWindow}
      />
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
