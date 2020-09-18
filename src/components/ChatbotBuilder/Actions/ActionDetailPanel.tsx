import { BaseAgentAction, IResponseOption } from '@bavard/agent-config';
import {
  Box,
  Button,
  Grid,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import SortableOptions from './SortableOptions';

type OtherProps = { [index: string]: any };

interface ActionDetailPanelProps {
  action: BaseAgentAction;
  onUpdateAction: (updatedAction: BaseAgentAction) => void;
}

const ActionDetailPanel = ({
  action,
  onUpdateAction,
}: ActionDetailPanelProps) => {
  const { type, name, ...otherProps } = action;
  const actionProps = otherProps as OtherProps;
  const [options, setOptions] = useState<IResponseOption[]>(action.options);

  const handleSaveChanges = () => {
    onUpdateAction({
      ...action,
      options,
    } as BaseAgentAction);
  };

  return (
    <Grid container={true} justify="center">
      <Grid item={true} xs={8}>
        {Array.from(Object.keys(actionProps)).map(key => (
          <Box my={3} key={key}>
            <Typography variant="h6" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{key}</Typography>
            {key === 'options' ? (
              <SortableOptions options={options} setOptions={setOptions}/>
            ) : key === 'text' ? (
              <p dangerouslySetInnerHTML={{ __html: actionProps[key] }} />
            ) : (
              <Typography variant="caption" style={{ textTransform: 'capitalize' }}>{JSON.stringify(actionProps[key])}</Typography>
            )}
          </Box>
        ))}
      </Grid>
      <Grid container={true} xs={2} justify="center" alignItems="center">
        <Button autoFocus={true} variant="contained" color="primary" onClick={handleSaveChanges}>
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default ActionDetailPanel;
