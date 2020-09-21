import { BaseAgentAction } from '@bavard/agent-config';
import {
  Box,
  Grid,
  Typography,
} from '@material-ui/core';
import React from 'react';

type OtherProps = { [index: string]: any };

interface ActionDetailPanelProps {
  action: BaseAgentAction;
}

const ActionDetailPanel = ({
  action,
}: ActionDetailPanelProps) => {
  const { type, name, ...otherProps } = action;
  const actionProps = otherProps as OtherProps;

  return (
    <Grid container={true}>
      <Grid item={true} xs={6}>
        {Array.from(Object.keys(actionProps)).map(key => (
          <Box my={3} key={key}>
            <Typography variant="h6" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{key}</Typography>
            {key === 'text' ? (
              <p dangerouslySetInnerHTML={{ __html: actionProps[key] }} />
            ) : (
              <Typography variant="caption" style={{ textTransform: 'capitalize' }}>{JSON.stringify(actionProps[key])}</Typography>
            )}
          </Box>
        ))}
      </Grid>
    </Grid>
  );
};

export default ActionDetailPanel;
