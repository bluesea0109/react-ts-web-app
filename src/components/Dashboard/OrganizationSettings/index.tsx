import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { useQuery } from 'react-apollo';
import { useParams } from 'react-router';
import { GET_ORGS } from '../../../common-gql-queries';
import { IOrg, IUser } from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import OrgMembersTable from './OrgMembersTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
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
      <OrgMembersTable members={org.members || []} user={props.user} refetchOrgs={refetch} />
    </div>
  );
}
