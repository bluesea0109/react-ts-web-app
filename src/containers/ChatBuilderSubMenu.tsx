import {
  createStyles,
  List,
  ListItem,
  Theme,
  Typography,
} from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { botSubMenuData } from './Drawer';
import SubMenuIcon from './IconButtons/SubMenuIcon';
interface BotSubMenuProps {
  title: string;
  items: any;
  category: string;
  getAgentPath: (item: string) => string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      color: 'white',
      padding: '0px 0px 0px 30px',
      marginRight: '15px',
    },
    blank: {
      height: '40px',
      marginLeft: '90px',
    },
  }),
);

const BotSubMenu = ({
  title,
  items,
  category,
  getAgentPath,
}: BotSubMenuProps) => {
  const classes = useStyles();
  const location = useLocation();
  const selectedStyle = {
    backgroundColor: '#4A90E2',
    padding: '8px 20px 8px 20px',
    borderRadius: '5px',
    wordwrap: 'normal',
    marginRight: '7px',
  };

  const selectedPath = location.pathname.split('/').reverse()[1];

  const selectedCategory = () => {
    if (
      botSubMenuData.configure.items.findIndex((item) => {
        return (
          item.path === selectedPath ||
          item.pathes?.findIndex((path) => path === selectedPath) !== -1
        );
      }) !== -1
    ) {
      return 'Configure';
    } else if (
      botSubMenuData.training.items.findIndex((item) => {
        return item.path === selectedPath;
      }) !== -1
    ) {
      return 'Training';
    } else if (
      botSubMenuData.launch.items.findIndex((item) => {
        return item.path === selectedPath;
      }) !== -1
    ) {
      return 'Launch';
    }
  };

  const renderItems = items.map((item: any, index: number) => (
    <ListItem
      component={Link}
      key={index}
      to={getAgentPath(item.path || item.pathes[0])}
      selected={location.pathname.includes(item.path || item.pathes[0])}
      button={true}
      className={classes.listItem}>
      <ListItemIcon style={{ color: 'white' }}>
        <SubMenuIcon title="Workspace" active={false} />
      </ListItemIcon>
      <ListItemText
        primary={item.title}
        style={
          // prettier-ignore
          location.pathname.includes(item.path) || item.pathes?.find((path: string) => location.pathname.includes(path))
            ? selectedStyle
            : { paddingLeft: '20px' }
        }
      />
    </ListItem>
  ));

  return (
    <List>
      <Typography
        className={classes.blank}
        style={
          category === selectedCategory()
            ? { color: '#4a90e2', fontWeight: 'bold' }
            : { color: 'white', fontWeight: 'bold' }
        }>
        {title}
      </Typography>
      {renderItems}
    </List>
  );
};

export default BotSubMenu;
