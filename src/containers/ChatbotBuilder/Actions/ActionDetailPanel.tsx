import { BaseAgentAction } from '@bavard/agent-config';
import { Box, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
createStyles({
  container: {
    paddingLeft: theme.spacing(6),
    paddingRight: 4,
  },
}));

type OtherProps = { [index: string]: any };

interface ActionDetailPanelProps {
  action: BaseAgentAction;
}

const ActionDetailPanel = ({
  action,
}: ActionDetailPanelProps) => {
  const classes = useStyles();
  const { type, name, ...otherProps } = action;
  const actionProps = otherProps as OtherProps;

  return (
    <Grid item={true} className={classes.container}>
      {Array.from(Object.keys(actionProps)).map(key => (
        <Box my={1} key={key}>
          <Typography variant="h6" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{key}</Typography>
          {key === 'text' ? (
            <p dangerouslySetInnerHTML={{ __html: actionProps[key] }} />
          ) : (
            <Typography variant="caption" style={{ textTransform: 'capitalize' }}>{JSON.stringify(actionProps[key])}</Typography>
          )}
        </Box>
      ))}
    </Grid>
  );
};

export default ActionDetailPanel;
