import { CircularProgress, createStyles, IconButton, Theme } from '@material-ui/core';
import AppBar, { AppBarProps } from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React from 'react';
import { useQuery, gql } from "@apollo/client";
import { useHistory, useLocation } from 'react-router-dom';

const GET_ORGS = gql`
  query {
    currentUser {
      activeOrg {
        id,
        name
      }
      activeProject {
        id,
        name
      }
    }
    orgs {
      id
      name
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    selectInput: {
      background: "primary",
      color: "white",
      borderRadius: 4,
      borderColor: 'white',
    }, icon: {
      fill: 'white',
    },
    border: {
      borderBottom: '1px solid white',
    },
  })
);

function CustomAppbar(props: CustomAppbarProps) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_ORGS);
  const history = useHistory();
  const location = useLocation();
  
  const setActiveOrg = async (orgId: string) => {
    let search = `?org=${orgId}`;
    history.push({
      pathname: location.pathname,
      search,
    });
    window.location.reload(false);
  };

  const renderProjects = () => {
    if (loading) {
      return <CircularProgress color="secondary" />
    }

    if (error) {
      // TODO: handle errors
      return <p>{JSON.stringify(error, null, 2)}</p>;
    }

    const activeOrg = data.currentUser.activeOrg;

    return (
      <>
        < Select
          value={activeOrg ? activeOrg.id : ""}
          onChange={(e) => setActiveOrg(String(e.target.value))}
          className={clsx(classes.selectInput)}
          inputProps={{
            classes: {
              root: classes.border,
              icon: classes.icon,
            },
          }}
        >
          {data.orgs.map((org: any) => <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>)}
        </Select >
      </>
    )
  }

  return (
    <AppBar
      position={props.position}
      className={props.className}
    >
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
          {"Bavard AI"}
        </Typography>
        {renderProjects()}
        <Button color="inherit">Logout</Button>
      </Toolbar>
    </AppBar>
  );
}

interface CustomAppbarProps extends AppBarProps {
  onMenuClick: () => void;
}

export default CustomAppbar;