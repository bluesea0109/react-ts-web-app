import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import { IconButton, useTheme, Theme, createStyles } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

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
          to="/"
          selected={location.pathname === "/"}
          button
        >
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          component={Link}
          to="/account"
          selected={location.pathname === "/account"}
          button
        >
          <ListItemText primary="Account" />
        </ListItem>
        <ListItem
          component={Link}
          to="/qa"
          selected={location.pathname === "/qa"}
          button
        >
          <ListItemText primary="Question Answering" />
        </ListItem>
        <ListItem
          component={Link}
          to="/text-labeling"
          selected={location.pathname === "/text-labeling"}
          button
        >
          <ListItemText primary="Text Labeling" />
        </ListItem>
        <ListItem
          component={Link}
          to="/image-labeling"
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