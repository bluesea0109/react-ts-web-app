import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import React, { useEffect } from 'react';
import { useMutation } from 'react-apollo';
import { useParams } from 'react-router-dom';
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
  const { inviteId } = useParams();
  const [acceptInvite, { error, loading }] = useMutation(ACCEPT_INVITE, {
    variables: { inviteId },
    onError: () => { },
  });

  useEffect(() => {
    try {
      acceptInvite({ variables: { inviteId } });
    } catch (err) {
      console.error(err);
    }
  }, [acceptInvite, inviteId]);

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  if (loading) {
    return <ContentLoading />;
  }

  // history.push(`/app/projects/${data.data.acceptProjectMemberInvite.projectId}`);
  return (
    <div className={classes.root}>
      <Typography>{'Invite accepted. Welcome to Bavard!'}</Typography>
    </div>
  );
}

const ACCEPT_INVITE = gql`
  mutation acceptOrgMemberInvite($inviteId: String!)  {
    acceptOrgMemberInvite(inviteId: $inviteId) {
      id
      email
      orgId
      orgName
      senderName
      senderEmail
      timestamp
      memberType
    }
  }
`;
