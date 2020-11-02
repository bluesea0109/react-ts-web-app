import {  makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { DropDown } from '../../../components';
import { IAgent } from '../../../models/chatbot-service';

interface ToolBarSettingProps {
  agents: IAgent[] | undefined;
  currentAgent: string | undefined;
  handleChange: (name: string) => void;
  saveAgent: () => void;
  publishAgent: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  label: {
    padding: '7px 10px 5px 0px',
  },
  dropdown: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: '10px',
    paddingRight: '20px',
    borderRight: '1px solid gray',
  },
  button: {
    padding: '10px 5px',
    marginLeft: '0px',
    marginRight: '15px',
    cursor: 'pointer',
  },
}));

export const ToolBarSetting = ({
  agents,
  currentAgent,
  handleChange,
  saveAgent,
  publishAgent,
}: ToolBarSettingProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.dropdown}>
        <Typography className={classes.label}>Current Assistant : </Typography>
        {agents && (
          <DropDown
            label=""
            current={agents.find((agent) => agent.uname === currentAgent)}
            menuItems={agents}
            onChange={handleChange}
            size="small"
          />
        )}
      </div>
      <div className={classes.button}>
        <div onClick={saveAgent}>
          <img src="/save-button.svg" alt="save" width="20px" height="20px" style={{marginRight: '5px'}}/>
          Save Agent
        </div>
      </div>
      <div className={classes.button}>
        <div onClick={publishAgent}>
        <img src="/rocket-icon_8.png" alt="save" width="20px" height="20px" style={{marginRight: '5px'}}/>
          Publish Assistant
        </div>
      </div>
    </div>
  );
};
