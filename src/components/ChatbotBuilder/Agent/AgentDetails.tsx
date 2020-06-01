<<<<<<< HEAD
import { makeStyles, Paper, Tab, Tabs, Theme, Toolbar, Box } from '@material-ui/core';
import React from 'react';
import { useHistory, useParams } from 'react-router';
=======
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
>>>>>>> 059037773fafdcf1186b35be1cc75427e78990bf
import Intent from '../Intent/Intent';
import Tag from '../Tags/Tag';
import Template from '../Template/Template';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
<<<<<<< HEAD
  index?: any;
  value?: any;
=======
  index: any;
  value: any;
>>>>>>> 059037773fafdcf1186b35be1cc75427e78990bf
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
    width: '100%',
<<<<<<< HEAD
  }
=======
  },
  appBarWarper: {
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
>>>>>>> 059037773fafdcf1186b35be1cc75427e78990bf
}));

 const AgentDetails = () => {
  const classes = useStyles();
<<<<<<< HEAD
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
          <Template/>
        </TabPanel>
=======
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" className={classes.appBarWarper}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="agent details tab"
        >
          <Tab label="Intents" {...a11yProps(0)} />
          <Tab label="Tags" {...a11yProps(1)} />
          <Tab label="Templates" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} >
          <Intent />
        </TabPanel>
        <TabPanel value={value} index={1}>
        <Tag />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Template/>
        </TabPanel>
      </SwipeableViews>
>>>>>>> 059037773fafdcf1186b35be1cc75427e78990bf
    </div>
  );
};

export default AgentDetails;
