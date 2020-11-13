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
import { GET_ORGS } from '../../../common-gql-queries';
import { IOrg, IUser } from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import DisablePaymentDialog from './DisablePaymentDialog';
import EnablePaymentDialog from './EnablePaymentDialog';
import InviteDialog from './InviteDialog';
import OrginvitedMember from './OrgInvitedMember';
import OrgMembersTable from './OrgMembersTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
    },
    tableWrapper: {
      display: 'flex',
    },
    pageTitle: {
      marginBottom: theme.spacing(3),
    },
  }),
);

interface IOrgSettingsProps {
  user: IUser;
}

interface IGetOrgs {
  orgs: IOrg[];
}

export default function OrganizationSettings(props: IOrgSettingsProps) {
  const classes = useStyles();
  const { orgId } = useParams<{ orgId: string }>();
  const { error, loading, data, refetch } = useQuery<IGetOrgs>(GET_ORGS, {
    variables: { id: orgId },
  });

  const [viewInviteDialog, showInviteDialog] = useState(false);

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  if (loading || !data) {
    return <ContentLoading shrinked={true} />;
  }

  if (data.orgs.length === 0) {
    return <Typography>{'Error: failed to load org data'}</Typography>;
  }

  const org = data.orgs[0];
  return (
    <div className={'page-container'}>
      <Typography className={classes.pageTitle} variant="h5">
        {'Membership'}
      </Typography>
      <Grid item={true} container={true} xs={10} spacing={2}>
        <Grid item={true} xs={12} sm={12}>
          <Card>
            <CardHeader
              avatar={<Group />}
              title={<h4>Organization Members</h4>}
              action={
                <React.Fragment>
                  {org.billingEnabled === true && (
                    <DisablePaymentDialog user={props.user} />
                  )}
                  {org.billingEnabled === false && (
                    <EnablePaymentDialog user={props.user} />
                  )}
                </React.Fragment>
              }
            />
            <OrgMembersTable
              members={org.members || []}
              user={props.user}
              refetchOrgs={refetch}
            />
          </Card>
        </Grid>
        <Grid item={true} xs={12} sm={12}>
          <Card>
            <CardHeader
              avatar={<PersonAdd />}
              title={<h4>Invited Organization Members</h4>}
              action={
                <Button
                  color="primary"
                  onClick={() => showInviteDialog(true)}
                  endIcon={<AddCircleOutline />}>
                  Invite a Member
                </Button>
              }
            />
            <OrginvitedMember />
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
