import { Box, makeStyles, Paper, Tab, Tabs, Theme, Toolbar } from '@material-ui/core';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import Intent from '../Intent/Intent';
import Tag from '../Tags/Tag';
import Template from '../Template/Template';
import UploadDataTab from '../UploadData/UploadDataTab';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index?: any;
  value?: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
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
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tabPanel: {
    overflow: 'auto',
  }
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
      <Paper>
        <Toolbar variant="dense" disableGutters={true}>
          <Tabs
            value={agentTab}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="primary"
          >
            <Tab value="Intents" label="Intents" {...a11yProps('Intents')} />
            <Tab value="Tags" label="Tags" {...a11yProps('Tags')} />
            <Tab value="Templates" label="Templates" {...a11yProps('Templates')} />
            <Tab value="upload-data" label="Upload Training Data" {...a11yProps('Templates')} />
          </Tabs>
        </Toolbar>
      </Paper>
      <TabPanel value={agentTab} index="Intents" >
        <Intent />
      </TabPanel>
      <TabPanel value={agentTab} index="Tags">
        <Tag />
      </TabPanel>
      <TabPanel value={agentTab} index="Templates" >
        <Template />
      </TabPanel>
      {agentTab === 'upload-data' && (
        <UploadDataTab />
      )}
    </div>
  );
};

export default AgentDetails;
