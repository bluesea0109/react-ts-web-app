import { Box, makeStyles, Tab, Tabs, Theme } from '@material-ui/core';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import ChatWithAgent from '../ChatWithAgent';
import DataExportsTab from '../DataExports/DataExportsTab';
import Examples from '../Examples/Examples';
import Intent from '../Intent/Intent';
import Tag from '../Tags/Tag';
import TrainingJobsTab from '../TrainingJobs/TrainingJobsTab';
import UploadDataTab from '../UploadData/UploadDataTab';
import UtteranceAction from '../UtteranceActions/UtteranceAction';

interface TabPanelProps {
  className?: string;
  children?: React.ReactNode;
  dir?: string;
  index?: any;
  value?: any;
}

function TabPanel(props: TabPanelProps) {
  const { className, children, value, index, ...other } = props;

  return (
    <div
      className={className}
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: '1 1 0',
    display: 'flex',
    overflow: 'auto',
  },
  tabPanel: {
    overflow: 'auto',
    width: '100%',
  },
}));

const AgentDetails = () => {
  const classes = useStyles();
  const { orgId, projectId, agentId, agentTab } = useParams();
  const history = useHistory();

  const handleChangeTab = (event: any, value: any) => {
    history.push({
      pathname: `/orgs/${orgId}/projects/${projectId}/chatbot-builder/agents/${agentId}/${value}`,
    });
  };

  return (
    <div className={classes.root}>
      <Tabs
        value={agentTab}
        onChange={handleChangeTab}
        indicatorColor="secondary"
        variant="scrollable"
        orientation="vertical"
        textColor="primary"
      >
        <Tab value="Intents" label="Intents" {...a11yProps('Intents')} />
        <Tab value="Tags" label="Tags" {...a11yProps('Tags')} />
        <Tab value="examples" label="Examples" {...a11yProps('Examples')} />
        <Tab value="actions" label="Agent Actions" {...a11yProps('Agent Actions')} />
        <Tab value="upload-data" label="Upload Data" {...a11yProps('Upload Data')} />
        <Tab value="exports" label="Data Exports" {...a11yProps('Data Exports')} />
        <Tab value="training-jobs" label="Training Jobs" {...a11yProps('Training Jobs')} />
        <Tab value="chat" label="Chat with Agent" {...a11yProps('Chat with Agent')} />
      </Tabs>
      <TabPanel className={classes.tabPanel} value={agentTab} index="Intents" >
        <Intent />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={agentTab} index="Tags">
        <Tag />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={agentTab} index="actions">
        <UtteranceAction />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={agentTab} index="examples" >
        <Examples />
      </TabPanel>
      {agentTab === 'upload-data' && (
        <UploadDataTab />
      )}
      {agentTab === 'exports' && (
        <DataExportsTab />
      )}
      {agentTab === 'training-jobs' && (
        <TrainingJobsTab />
      )}
      {agentTab === 'chat' && (
        <ChatWithAgent />
      )}
    </div>
  );
};

export default AgentDetails;
