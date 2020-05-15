import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ApolloError } from 'apollo-client'
import { GraphQLError } from 'graphql';

const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1)
    }
  })
);

interface IErrorPageProps {
  error: ApolloError,
}

export default function ApolloErrorPage(props: IErrorPageProps) {
  const { error } = props;
  const classes = styles();
  console.error(error);

  const defaultMessage = (
    <Typography variant="body1">
      {"An unexpected error occurred. Please refresh the page and try again. If the problem persists, please email support@bavard.ai."}
    </Typography>
  );

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        {error && error.graphQLErrors.length ? (
          error.graphQLErrors.map((e: GraphQLError) => {
            if (!e.extensions) {
              return defaultMessage;
            }

            switch (e.extensions.code) {
              case 'INTERNAL_SERVER_ERROR': {
                return defaultMessage;
              }
              case 'FORBIDDEN': {
                return (
                  <Typography variant="body1">
                    {e.message}
                  </Typography>
                );
              }
              case 'BILLING_REQUIRED': {
                return (
                  <Typography variant="body1">
                    {e.message}
                  </Typography>
                );
              }
              default: {
                return (
                  <Typography variant="body1">
                    {"An unexpected error occurred. Please refresh the page and try again. If the problem persists, please email support@bavard.ai."}
                  </Typography>
                );
              }
            }
          })
        ) : defaultMessage}
      </Grid>
    </Grid>
  );
}
