import { useMutation } from '@apollo/react-hooks';
import {
  CircularProgress,
  createStyles,
  IconButton,
  Theme,
} from '@material-ui/core';
import AppBar, { AppBarProps } from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { GET_CURRENT_USER, UPDATE_ACTIVE_ORG } from '../gql-queries';
import { IUser } from '../models';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    selectInput: {
      background: 'primary',
      color: 'white',
      borderRadius: 4,
      borderColor: 'white',
    },
    icon: {
      fill: 'white',
    },
    border: {
      borderBottom: '1px solid white',
    },
  }),
);

function CustomAppbar(props: CustomAppbarProps) {
  const classes = useStyles();
  const history = useHistory();

  const [updateActiveOrg, { loading, error }] = useMutation(UPDATE_ACTIVE_ORG,
    {
      refetchQueries: [{ query: GET_CURRENT_USER }],
      awaitRefetchQueries: true,
      onCompleted: () => {
        history.push('/'); // back to dashboard. TODO: keep the user on their current tab.
      },
    });

  const setActiveOrg = async (orgId: string) => {
    const org = props.user.orgs.find(x => x.id === orgId);
    const projects = org?.projects;

    const projectId = projects?.[0]?.id;
    updateActiveOrg({
      variables: {
        orgId,
        ...projectId && { projectId },
      },
    });
  };

  const renderProjects = () => {
    if (loading) {
      return <CircularProgress color="secondary" />;
    }

    if (error) {
      // TODO: handle errors
      console.error(error);
      return <Typography>{'Error'}</Typography>;
    }

    const activeOrg = props.user.activeOrg;

    return (
      <>
        <Select
          value={activeOrg ? activeOrg.id : ''}
          onChange={(e) => setActiveOrg(String(e.target.value))}
          className={clsx(classes.selectInput)}
          inputProps={{
            classes: {
              root: classes.border,
              icon: classes.icon,
            },
          }}
        >
          {props.user.orgs.map((org: any) => <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>)}
        </Select >
      </>
    );
  };

  return (
    <AppBar position={props.position} className={props.className}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={props.onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {'Bavard AI'}
        </Typography>
        {renderProjects()}
        <Button color="inherit">Logout</Button>
      </Toolbar>
    </AppBar>
  );
}

interface CustomAppbarProps extends AppBarProps {
  onMenuClick: () => void;
  user: IUser;
}

export default CustomAppbar;
