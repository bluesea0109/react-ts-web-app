import { useMutation } from '@apollo/client';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { resetApolloContext } from '../../../apollo-client';
import {
  GET_CURRENT_USER,
  UPDATE_ACTIVE_WORKSPACE,
} from '../../../common-gql-queries';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
    },
  }),
);

export default function AcceptInvite() {
  const classes = useStyles();
  const { inviteId } = useParams<{ inviteId: string }>();
  const [updateActiveOrg, updateActiveOrgResult] = useMutation(
    UPDATE_ACTIVE_WORKSPACE,
    {
      refetchQueries: [{ query: GET_CURRENT_USER }],
      awaitRefetchQueries: true,
    },
  );

  const [acceptInvite, { error, loading }] = useMutation(ACCEPT_INVITE, {
    variables: { inviteId },
    onError: () => {},
    onCompleted: async (data) => {
      resetApolloContext();
      if (data?.acceptWorkspaceMemberInvite?.workspaceId) {
        await updateActiveOrg({
          variables: {
            workspaceId: data?.acceptWorkspaceMemberInvite?.workspaceId,
          },
        });
      }
    },
  });
  useEffect(() => {
    try {
      (async () => {
        await acceptInvite({ variables: { inviteId } });
        resetApolloContext();
      })();
    } catch (err) {
      console.error(err);
    }
  }, [acceptInvite, inviteId]);

  const err = error || updateActiveOrgResult.error;
  if (err) {
    return <ApolloErrorPage error={err} />;
  }

  if (loading || updateActiveOrgResult.loading) {
    return <ContentLoading shrinked={true} />;
  }

  return (
    <div className={classes.root}>
      <Typography>{'Invite accepted. Welcome to Bavard!'}</Typography>
    </div>
  );
}

const ACCEPT_INVITE = gql`
  mutation acceptWorkspaceMemberInvite($inviteId: String!) {
    acceptWorkspaceMemberInvite(inviteId: $inviteId) {
      id
      email
      workspaceId
      workspaceName
      senderName
      senderEmail
      timestamp
      role
    }
  }
`;
