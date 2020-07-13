import { createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { useQuery } from 'react-apollo';
import { useParams } from 'react-router';
import { GET_ORGS } from '../../../common-gql-queries';
import { IOrg, IUser } from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
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
  const { orgId } = useParams();
  const { error, loading, data, refetch } = useQuery<IGetOrgs>(GET_ORGS, { variables: { id: orgId }});

  if (error) {
    return <ApolloErrorPage error={error}/>;
  }

  if (loading || !data) {
    return <ContentLoading />;
  }

  if (data.orgs.length === 0) {
    return <Typography>{'Error: failed to load org data'}</Typography>;
  }

  const org = data.orgs[0];

  return (
    <div className={classes.root}>
      <Typography>{'Organization Settings'}</Typography>
      <Grid item={true} container={true} xs={12} spacing={2}>
          <Grid item={true} xs={12} sm={6}>
             <OrgMembersTable members={org.members || []} user={props.user} refetchOrgs={refetch} />
          </Grid>
          <Grid item={true} xs={12} sm={6}>
            <OrginvitedMember />
          </Grid>
      </Grid>
    </div>
  );
}
