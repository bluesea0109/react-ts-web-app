import { ApolloError } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { GraphQLError } from 'graphql';
import React from 'react';
import BillingUpgradeDialog from './Billing/BillingUpgradeDialog';

const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
    },
  }),
);

interface IErrorPageProps {
  error: ApolloError;
}

const ApolloErrorPage: React.FC<IErrorPageProps> = ({ error }) => {
  const classes = styles();

  const DefaultMessage = () => (
    <Typography variant="body1">
      {
        'An unexpected error occurred. Please refresh the page and try again. If the problem persists, please email support@bavard.ai.'
      }
    </Typography>
  );

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={12}>
        {error && error.graphQLErrors.length ? (
          error.graphQLErrors.map((e: GraphQLError, index: number) => {
            if (!e.extensions) return <DefaultMessage key={index} />;

            switch (e.extensions.code) {
              case 'INTERNAL_SERVER_ERROR':
                return <DefaultMessage key={index} />;
              case 'FORBIDDEN':
                return <Typography variant="body1">{e.message}</Typography>;
              case 'BILLING_REQUIRED':
              case 'WORKSPACE_LIMIT_REACHED':
                return <BillingUpgradeDialog isOpen={true} />;
              default:
                return <DefaultMessage key={index} />;
            }
          })
        ) : (
          <DefaultMessage />
        )}
      </Grid>
    </Grid>
  );
};

export default ApolloErrorPage;
