import { Box, makeStyles, Tab, Tabs, Theme } from '@material-ui/core';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import Actions from '../Actions/Actions';
import ChatWithAgent from '../ChatWithAgent';
import ConversationsTab from '../Conversations';
import DataExportsTab from '../DataExports/DataExportsTab';
import Examples from '../Examples/Examples';
import GraphPolicy from '../GraphPolicy';
import Intent from '../Intent/Intent';
import Options from '../Options/Option';
import Tag from '../Tags/Tag';
import TrainingConversations from '../TrainingConversations';
import TrainingJobsTab from '../TrainingJobs/TrainingJobsTab';
import UploadDataTab from '../UploadData/UploadDataTab';

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
      {...other}>
      {value === index && <Box p={3}>{children}</Box>}
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
        textColor="primary">
        <Tab value="Actions" label="Actions" {...a11yProps('Actions')} />
        <Tab value="Intents" label="Intents" {...a11yProps('Intents')} />
        <Tab value="Options" label="Options" {...a11yProps('Options')} />
        <Tab value="Tags" label="Tags" {...a11yProps('Tags')} />
        <Tab
          value="nluExamples"
          label="NLU Examples"
          {...a11yProps('NLU Examples')}
        />
        <Tab
          value="graph-policy"
          label="Graph Policy"
          {...a11yProps('Graph Policy')}
        />
        <Tab
          value="upload-data"
          label="Upload Data"
          {...a11yProps('Upload Data')}
        />
        <Tab
          value="exports"
          label="Data Exports"
          {...a11yProps('Data Exports')}
        />
        <Tab
          value="training-jobs"
          label="Training Jobs"
          {...a11yProps('Training Jobs')}
        />
        <Tab
          value="chat"
          label="Chat with Agent"
          {...a11yProps('Chat with Agent')}
        />
        <Tab
          value="training-conversations"
          label="Training conversations"
          {...a11yProps('Training conversations')}
        />
        <Tab
          value="live-conversations"
          label="Live conversations"
          {...a11yProps('Live conversations')}
        />
      </Tabs>
      <TabPanel className={classes.tabPanel} value={agentTab} index="Actions">
        <Actions />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={agentTab} index="Intents">
        <Intent />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={agentTab} index="Options">
        <Options />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={agentTab} index="Tags">
        <Tag />
      </TabPanel>
      <TabPanel
        className={classes.tabPanel}
        value={agentTab}
        index="nluExamples">
        <Examples />
      </TabPanel>
      {agentTab === 'upload-data' && <UploadDataTab />}
      {agentTab === 'graph-policy' && <GraphPolicy />}
      {agentTab === 'exports' && <DataExportsTab />}
      {agentTab === 'training-jobs' && <TrainingJobsTab />}
      {agentTab === 'chat' && <ChatWithAgent />}
      {agentTab === 'training-conversations' && <TrainingConversations />}
      {agentTab === 'live-conversations' && <ConversationsTab />}
    </div>
  );
};

export default AgentDetails;
