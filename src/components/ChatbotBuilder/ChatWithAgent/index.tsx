import { useQuery } from '@apollo/react-hooks';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import config from '../../../config';
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
  const apiKey = useRef<string | null>(null);
  const classes = useStyles();
  const [isActive, setIsActive] = useState(true);
  const [isDebug, setIsDebug] = useState(false);
  const iframe = useRef<HTMLIFrameElement | null>(null);

  const apiKeysQuery = useQuery(getApiKeysQuery, {
    variables: {
      projectId,
    },
    skip: !projectId,
  });

  const loadedKey = apiKeysQuery.data?.apiKey.key ?? null;

  useEffect(() => {
    if (!apiKeysQuery.loading) {
      apiKey.current = loadedKey;
    }
  }, [loadedKey, apiKeysQuery.loading]);

  const onMessage = useCallback((e: any) => {
    if (e.data.hasOwnProperty('isWidgetActive')) {
      setIsActive(e.data.isWidgetActive);
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

  const onIframeLoad = () => {
    iframe.current?.contentWindow?.postMessage({
      agentID: agentId,
      apiKey,
      isActive: true,
    }, '*');
  };

  return (
    <div
      className={classes.root}
      id="chatbot"
    >
      {(!!apiKey && !!agentId) && (
        <iframe
          title="chatbot"
          src={config.chatbotUrl}
          ref={ref => iframe.current = ref}
          onLoad={onIframeLoad}
          style={{
            border: 'none',
            display: 'block',
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
      )}
    </div>
  );
}
