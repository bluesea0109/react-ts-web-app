import { useQuery } from '@apollo/client';
import {
  Button,
  Card,
  CardHeader,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { AddCircleOutline, Group, PersonAdd } from '@material-ui/icons';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { GET_WORKSPACES } from '../../../common-gql-queries';
import { IWorkspace, IUser } from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import DisablePaymentDialog from './DisablePaymentDialog';
import EnablePaymentDialog from './EnablePaymentDialog';
import InviteDialog from './InviteDialog';
import WorkspaceInvitedMember from './WorkspaceInvitedMember';
import WorkspaceMembersTable from './WorkspaceMembersTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
    },
    tableWrapper: {
      display: 'flex',
    },
    pageTitle: {
      fontSize: '26px',
      marginTop: '20px',
      marginBottom: theme.spacing(3),
    },
  }),
);

interface IWorkspaceSettingsProps {
  user: IUser;
}

interface IGetWorkspaces {
  workspaces: IWorkspace[];
}

export default function WorkspaceSettings(props: IWorkspaceSettingsProps) {
  const classes = useStyles();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { error, loading, data, refetch } = useQuery<IGetWorkspaces>(
    GET_WORKSPACES,
    {
      variables: { id: workspaceId },
    },
  );

  const [viewInviteDialog, showInviteDialog] = useState(false);

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  if (loading || !data) {
    return <ContentLoading shrinked={true} />;
  }

  if (data.workspaces.length === 0) {
    return <Typography>{'Error: failed to load workspace data'}</Typography>;
  }

  const workspace = data.workspaces[0];
  return (
    <div className={'page-container'}>
      <Typography className={classes.pageTitle}>{'Membership'}</Typography>
      <Grid item={true} container={true} xs={10} spacing={2}>
        <Grid item={true} xs={12} sm={12}>
          <Card>
            <CardHeader
              avatar={<Group />}
              title={<h4>Workspace Members</h4>}
              action={
                <React.Fragment>
                  {workspace.billingEnabled === true && (
                    <DisablePaymentDialog />
                  )}
                  {workspace.billingEnabled === false && (
                    <EnablePaymentDialog/>
                  )}
                </React.Fragment>
              }
            />
            <WorkspaceMembersTable
              members={workspace.members || []}
              user={props.user}
              refetchWorkspaces={refetch}
            />
          </Card>
        </Grid>
        <Grid item={true} xs={12} sm={12}>
          <Card>
            <CardHeader
              avatar={<PersonAdd />}
              title={<h4>Invited Workspace Members</h4>}
              action={
                <Button
                  color="primary"
                  onClick={() => showInviteDialog(true)}
                  endIcon={<AddCircleOutline />}>
                  Invite a Member
                </Button>
              }
            />
            <WorkspaceInvitedMember />
          </Card>
          {viewInviteDialog && (
            <InviteDialog
              open={viewInviteDialog}
              onClose={() => showInviteDialog(false)}
              onSuccess={() => showInviteDialog(false)}
              user={props.user}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
}
