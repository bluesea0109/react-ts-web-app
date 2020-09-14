import { useMutation, useQuery } from '@apollo/client';
import { AgentConfig } from '@bavard/agent-config';
import { Box, Button, makeStyles, Tab, Tabs, Theme, Toolbar } from '@material-ui/core';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { CHATBOT_GET_AGENT, CHATBOT_SAVE_CONFIG_AND_SETTINGS } from '../../../common-gql-queries';
import { IAgent } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import Actions from '../Actions/Actions';
import AgentSettings from '../AgentSettings/AgentSettings';
import { currentAgentConfig, currentWidgetSettings } from '../atoms';
import ChatWithAgent from '../ChatWithAgent';
import ConversationsTab from '../Conversations';
import DataExportsTab from '../DataExports/DataExportsTab';
import Examples from '../Examples/Examples';
import GraphPolicy from '../GraphPolicy';
import Intent from '../Intent/Intent';
import Options from '../Options/Option';
import PublishAgent from '../Publish';
import Slot from '../Slot/Slot';
import Tag from '../Tags/Tag';
import TrainingJobsTab from '../TrainingJobs/TrainingJobsTab';

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
  },
  tabsContainer: {
    flex: '1 1 0',
    display: 'flex',
    overflow: 'auto',
    height: '50%',
  },
  tabPanel: {
    overflow: 'auto',
    width: '100%',
  },
  toolbar: {
    background: '#f5f5f5',
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

interface IGetAgent {
  ChatbotService_agent: IAgent;
}

const AgentDetails = () => {
  const classes = useStyles();
  const { orgId, projectId, agentId, agentTab } = useParams();
  const history = useHistory();
  const [config, setConfig] = useRecoilState(currentAgentConfig);
  const [widgetSettings, setWidgetSettings] = useRecoilState(currentWidgetSettings);

  const { error, loading, data, refetch } = useQuery<IGetAgent>(CHATBOT_GET_AGENT, {
    variables: { agentId: Number(agentId) },
    onCompleted: (data) => {
      setConfig(AgentConfig.fromJsonObj(data.ChatbotService_agent.config));
      setWidgetSettings(data.ChatbotService_agent.widgetSettings);
    },
  });

  const [updateAgent, updateAgentData] = useMutation(CHATBOT_SAVE_CONFIG_AND_SETTINGS, {
    refetchQueries: [{ query: CHATBOT_GET_AGENT, variables: { agentId: Number(agentId) } }],
    awaitRefetchQueries: true,
  });

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  if (loading || updateAgentData?.loading || !data) {
    return <ContentLoading />;
  }

  const handleChangeTab = (event: any, value: any) => {
    history.push({
      pathname: `/orgs/${orgId}/projects/${projectId}/chatbot-builder/agents/${agentId}/${value}`,
    });
  };

  const saveAgent = async () => {
    updateAgent({
      variables: {
        agentId: Number(agentId),
        config: config?.toJsonObj(),
        uname: config?.toJsonObj().uname,
        settings: widgetSettings,
      },
    });
    const result = await refetch();
    const agentData = result?.data?.ChatbotService_agent;
    if (agentData) {
      setConfig(AgentConfig.fromJsonObj(agentData.config));
      setWidgetSettings(agentData?.widgetSettings);
    }
  };

  return (
    <div>
      <Toolbar className={classes.toolbar} variant="dense">
        <Button variant="contained" onClick={saveAgent}>{'Save Agent'}</Button>
      </Toolbar>
      <div className={classes.tabsContainer}>
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
          <Tab value="Slots" label="Slots" {...a11yProps('Slots')} />
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
          <Tab value="settings" label="settings" {...a11yProps('Settings')} />
          <Tab value="publish" label="publish" {...a11yProps('Publish')} />
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
        <TabPanel className={classes.tabPanel} value={agentTab} index="Slots">
          <Slot />
        </TabPanel>
        <TabPanel
          className={classes.tabPanel}
          value={agentTab}
          index="nluExamples">
          <Examples />
        </TabPanel>
        {agentTab === 'graph-policy' && <GraphPolicy />}
        {agentTab === 'exports' && <DataExportsTab />}
        {agentTab === 'training-jobs' && <TrainingJobsTab />}
        {agentTab === 'chat' && <ChatWithAgent />}
        {agentTab === 'live-conversations' && <ConversationsTab />}
        {agentTab === 'settings' && <AgentSettings />}
        {agentTab === 'publish' && <PublishAgent />}
      </div>
    </div>
  );
};

export default AgentDetails;
