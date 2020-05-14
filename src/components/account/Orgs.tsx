import { useQuery } from '@apollo/client';
import {
  Card,
  CardContent,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { GET_ORGS } from '../../gql-queries';
import ContentLoading from '../ContentLoading';

interface IReceivedData {
  orgs: IOrg[];
}

interface IOrg {
  id: string;
  name: string;
  members: IMember[];
}

interface IMember {
  orgId?: string;
  uid: string;
  memberType: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    title: {
      fontSize: 20,
    },
  }),
);

function Orgs() {
  const classes = useStyles();
  const { loading, data, error } = useQuery<IReceivedData>(GET_ORGS);
  const orgs = useMemo(() => data?.orgs, [data]);

  const getCard = (org: IOrg) => {
    return (
      <Grid key={org.id} item={true} xs={12} sm={3}>
        <Card>
          <CardContent>
            <Typography
              className={classes.title}
              color="textPrimary"
              gutterBottom={true}>
              {`Name: ${org.name}`}
            </Typography>
            <Typography color="textPrimary" gutterBottom={true}>
              {`Id: ${org.id}`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const renderOrgs = () => {
    return orgs ? (
      <Grid container={true} spacing={1}>
        {orgs.map(getCard)}
      </Grid>
    ) : (
      <Typography align="center" variant="h6">
        {'No organizations found'}
      </Typography>
    );
  };

  return loading ? (
    <ContentLoading />
  ) : (
    <div>
      <Card className={clsx(classes.root)}>
        <Typography variant="h4">{'Organizations'}</Typography>
        {renderOrgs()}
      </Card>
    </div>
  );
}

export default Orgs;
