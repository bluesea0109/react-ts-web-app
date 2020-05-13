import { createStyles, IconButton, Theme, useTheme } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
  }));

interface CustomDrawerProps extends DrawerProps {

}

function CustomDrawer(props: CustomDrawerProps) {
  const classes = useStyles();
  const location = useLocation()
  const theme = useTheme();

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={(ev) => props.onClose ? props.onClose(ev, 'backdropClick') : null}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem
          component={Link}
          to={{
            pathname: "/",
            search: location.search,
          }}
          selected={location.pathname === "/"}
          button
        >
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          component={Link}
          to={{
            pathname: "/account",
            search: location.search,
          }}
          selected={location.pathname === "/account"}
          button
        >
          <ListItemText primary="Account" />
        </ListItem>
        <ListItem
          component={Link}
          to={{
            pathname: "/qa",
            search: location.search,
          }}
          selected={location.pathname === "/qa"}
          button
        >
          <ListItemText primary="Question Answering" />
        </ListItem>
        <ListItem
          component={Link}
          to={{
            pathname: "/text-summarization",
            search: location.search,
          }}
          selected={location.pathname === "/text-summarization"}
          button
        >
          <ListItemText primary="Text Summarization" />
        </ListItem>
        <ListItem
          component={Link}
          to={{
            pathname: "/chatbot-builder",
            search: location.search,
          }}
          selected={location.pathname === "/chatbot-builder"}
          button
        >
          <ListItemText primary="Chatbot Builder" />
        </ListItem>
        <ListItem
          component={Link}
          to={{
            pathname: "/text-labeling",
            search: location.search,
          }}
          selected={location.pathname === "/text-labeling"}
          button
        >
          <ListItemText primary="Text Labeling" />
        </ListItem>
        <ListItem
          component={Link}
          to={{
            pathname: "/image-labeling/collections",
            search: location.search,
          }}
          selected={location.pathname === "/image-labeling"}
          button
        >
          <ListItemText primary="Image Labeling" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Drawer anchor="left" {...props}>
      {list()}
    </Drawer>
  );
}

export default CustomDrawer;