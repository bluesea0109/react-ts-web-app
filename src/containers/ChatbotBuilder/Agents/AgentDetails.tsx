import { useMutation, useQuery } from '@apollo/client';
import { AgentConfig } from '@bavard/agent-config';
import { Box, makeStyles, Theme, Toolbar } from '@material-ui/core';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import {
  CHATBOT_GET_AGENT,
  CHATBOT_SAVE_CONFIG_AND_SETTINGS,
} from '../../../common-gql-queries';
import { CHATBOT_GET_AGENTS } from '../../../common-gql-queries';
import { TabPanel } from '../../../components';
import { IAgent } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import Actions from '../Actions/Actions';
import AgentSettings from '../AgentSettings/AgentSettings';
import AssistDemo from '../AssistDemo';
import { currentAgentConfig, currentWidgetSettings } from '../atoms';
import ConversationsTab from '../Conversations';
import DataExportsTab from '../DataExports/DataExportsTab';
import Examples from '../Examples/Examples';
import GraphPolicyV1 from '../GraphPolicy';
import GraphPolicy from '../GraphPolicyV2';
import GraphEditorPage from '../GraphPolicyV2/GraphEditorPage';
import Intent from '../Intent/Intent';
import PublishAgent from '../Publish';
import Slot from '../Slot/Slot';
import Tag from '../Tags/Tag';
import TrainingConversations from '../TrainingConversations';
import TrainingJobsTab from '../TrainingJobs/TrainingJobsTab';
import UploadDataTab from '../UploadData/UploadDataTab';
import { ToolBarSetting } from './ToolbarSetting';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  tabsContainer: {
    flex: '1 1 0',
    display: 'flex',
    overflow: 'auto',
    height: '100%',
  },
  tabPanel: {
    overflow: 'auto',
    width: '100%',
    background: '#f5f5f5',
  },
  toolbar: {
    background: '#ddd',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  saveAgent: {
    position: 'absolute',
    width: '150px',
    backgroundColor: '#151630',
    color: 'white',
    padding: '5px',
    borderTopLeftRadius: '30px',
    borderBottomLeftRadius: '30px',
    margin: '60px 0px 20px 20px',
    cursor: 'pointer',
    boxShadow: '0 0 3px #333',
    zIndex: 500000,

    animation: '$hoverOut 500ms',
    right: '-110px',
    '&:hover': {
      background:
        'linear-gradient(137deg, rgba(2,0,36,1) 66%, rgba(0,212,255,1) 100%, rgba(9,9,121,1) 100%)',
      animation: '$hoverIn 500ms',
      right: '0px',
    },
    '&:active': {
      backgroundColor: 'green',
    },
  },
  buttonTitle: {
    marginTop: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
  },

  '@keyframes hoverIn': {
    from: { right: '-110px' },
    to: { right: '0px' },
  },
  '@keyframes hoverOut': {
    from: { right: '0px' },
    to: { right: '-110px' },
  },
}));

interface IGetAgent {
  ChatbotService_agent: IAgent;
}

interface IGetAgents {
  ChatbotService_agents: IAgent[] | undefined;
}

const AgentDetails = () => {
  const classes = useStyles();
  const { agentId, agentTab, projectId, orgId } = useParams<{
    orgId: string;
    projectId: string;
    agentId: string;
    agentTab: string;
  }>();

  const history = useHistory();
  const agentsData = useQuery<IGetAgents>(CHATBOT_GET_AGENTS, {
    variables: { projectId },
  });
  const agents: IAgent[] | undefined =
    agentsData && agentsData.data && agentsData.data.ChatbotService_agents;
  const [widgetSettings, setWidgetSettings] = useRecoilState(
    currentWidgetSettings,
  );

  const init = agents?.filter((item) => item.id === parseInt(agentId, 10))[0]?.uname;

  const [curAgent, setCurAgent] = useState<string | undefined>(init);

  const [config, setConfig] = useRecoilState(currentAgentConfig);

  const { error, loading, data } = useQuery<IGetAgent>(CHATBOT_GET_AGENT, {
    variables: { agentId: Number(agentId) },
    onCompleted: (data) => {
      setConfig(AgentConfig.fromJsonObj(data.ChatbotService_agent.config));
      setWidgetSettings(data.ChatbotService_agent.widgetSettings);
    },
  });

  const [updateAgent, updateAgentData] = useMutation(
    CHATBOT_SAVE_CONFIG_AND_SETTINGS,
    {
      refetchQueries: [
        { query: CHATBOT_GET_AGENT, variables: { agentId: Number(agentId) } },
      ],
      awaitRefetchQueries: true,
    },
  );

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  if (loading || updateAgentData?.loading || !data) {
    return <ContentLoading shrinked={true}/>;
  }
  const saveAgent = () => {
    if (!!config) {
      updateAgent({
        variables: {
          agentId: Number(agentId),
          config: config.toJsonObj(),
          uname: config?.toJsonObj().uname,
          settings: widgetSettings,
        },
      });
    }
  };

  const publishAgent = () => {
    const newURL = `/orgs/${orgId}/projects/${projectId}/chatbot-builder/agents/${agentId}/publish`;
    history.push(newURL);
  };

  const handleAgentChanage = (field: string) => {
    setCurAgent(field);

    const agentId = agents?.filter((agent) => agent.uname === field)[0].id;
    const newURL = `/orgs/${orgId}/projects/${projectId}/chatbot-builder/agents/${agentId}/Actions`;
    history.push(newURL);
  };

  return (
    <Box className={classes.container}>
      <Toolbar className={classes.toolbar} variant="dense">
        <ToolBarSetting
          agents={agents}
          currentAgent={curAgent}
          handleChange={handleAgentChanage}
          saveAgent={saveAgent}
          publishAgent={publishAgent}
        />
      </Toolbar>
      <Box className={classes.tabsContainer}>
        <TabPanel
          index="Actions"
          value={agentTab}
          className={classes.tabPanel}
          tabName="Manage Assistant Actions">
          <Actions />
        </TabPanel>
        <TabPanel index="Intents" value={agentTab} className={classes.tabPanel}>
          <Intent />
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
        {agentTab === 'graph-policy-v1' && <GraphPolicyV1 />}
        {agentTab === 'graph-policies' && <GraphPolicy />}
        {agentTab === 'graph-editor' && <GraphEditorPage />}
        {agentTab === 'exports' && <DataExportsTab />}
        {agentTab === 'training-jobs' && <TrainingJobsTab />}
        {agentTab === 'chats' && <AssistDemo />}
        {agentTab === 'live-conversations' && <ConversationsTab />}
        {agentTab === 'training-conversations' && <TrainingConversations />}
        {agentTab === 'settings' && <AgentSettings />}
        {agentTab === 'publish' && <PublishAgent />}
        {agentTab === 'upload-data' && <UploadDataTab />}
        <div onClick={saveAgent} />
      </Box>
    </Box>
  );
};

export default AgentDetails;
