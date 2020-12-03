import { ApolloError } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { GraphQLError } from 'graphql';
import React from 'react';
import { useHistory } from 'react-router-dom';
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
  onClose?: () => void;
}

const ApolloErrorPage: React.FC<IErrorPageProps> = ({ error, onClose }) => {
  const classes = styles();
  const history = useHistory();

  const DefaultMessage = () => (
    <Typography variant="body1">
      {
        'An unexpected error occurred. Please refresh the page and try again. If the problem persists, please email support@bavard.ai.'
      }
    </Typography>
  );

  const handleCloseBillingUpgradeDialog = () => {
    onClose?.();
  };

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
              case 'WORKSPACE_LIMIT_REACHED':
                return <Typography variant="body1">{e.message}</Typography>;
              case 'BILLING_REQUIRED':
                return (
                  <BillingUpgradeDialog
                    isOpen={true}
                    onClose={handleCloseBillingUpgradeDialog}
                  />
                );
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
