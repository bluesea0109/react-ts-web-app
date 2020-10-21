import { useMutation, useQuery } from '@apollo/client';
import { AgentConfig } from '@bavard/agent-config';
import { Box, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import {
  CHATBOT_GET_AGENT,
  CHATBOT_SAVE_CONFIG_AND_SETTINGS,
} from '../../../common-gql-queries';
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
import GraphPolicy from '../GraphPolicy';
import Intent from '../Intent/Intent';
import PublishAgent from '../Publish';
import Slot from '../Slot/Slot';
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
  },
  toolbar: {},
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
      background: 'linear-gradient(137deg, rgba(2,0,36,1) 66%, rgba(0,212,255,1) 100%, rgba(9,9,121,1) 100%)',
      animation: '$hoverIn 500ms',            
      right: '0px',
    },
    '&:active': {
      backgroundColor: 'green'
    } 
  },
  buttonTitle: {
    marginTop: '15px',
    fontSize: '18px',
    fontWeight: 'bold'
  },

  '@keyframes hoverIn' : {
    from: { right: '-110px'},
    to: { right: '0px'}
  }, 
  '@keyframes hoverOut' : {
    from: { right: '0px'},
    to: { right: '-110px'}
  } 

}));

interface IGetAgent {
  ChatbotService_agent: IAgent;
}

const AgentDetails = () => {
  const classes = useStyles();
  const { agentId, agentTab } = useParams<{
    orgId: string;
    projectId: string;
    agentId: string;
    agentTab: string;
  }>();
  const [config, setConfig] = useRecoilState(currentAgentConfig);
  const [widgetSettings, setWidgetSettings] = useRecoilState(
    currentWidgetSettings
  );

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
    }
  );

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  if (loading || updateAgentData?.loading || !data) {
    return <ContentLoading />;
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

  return (
    <div className={classes.container}>
      <div className={classes.saveAgent}>
        <Grid container={true} onClick={saveAgent}>
          <Grid item xs={4}>
            <img src={'/bot.svg'} alt="logo" width="50px" height="50px" />{' '}
          </Grid>
          <Grid item xs={8} className={classes.buttonTitle}>
            Save Agent
          </Grid>
        </Grid>
      </div>
      <div className={classes.tabsContainer}>
        <TabPanel className={classes.tabPanel} value={agentTab} index="Actions">
          <Actions />
        </TabPanel>
        <TabPanel className={classes.tabPanel} value={agentTab} index="Intents">
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
        {agentTab === 'graph-policy' && <GraphPolicy />}
        {agentTab === 'exports' && <DataExportsTab />}
        {agentTab === 'training-jobs' && <TrainingJobsTab />}
        {agentTab === 'chats' && <AssistDemo />}
        {agentTab === 'live-conversations' && <ConversationsTab />}
        {agentTab === 'training-conversations' && <TrainingConversations />}
        {agentTab === 'settings' && <AgentSettings />}
        {agentTab === 'publish' && <PublishAgent />}
        {agentTab === 'upload-data' && <UploadDataTab />}
        <div onClick={saveAgent} />
      </div>
    </div>
  );
};

export default AgentDetails;
