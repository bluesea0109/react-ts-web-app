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
import React, { useCallback, useEffect } from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { initialise, setActiveOrg } from "../store/auth/actions";
import { fetchOrgs } from "../store/organisations/actions";
import { getFetchingOrganisations, getOrganisations } from "../store/organisations/selector";
import { getActiveOrg } from '../store/selectors';
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
  const activeOrg = useSelector(getActiveOrg);
  const organisations = useSelector(getOrganisations);
  const organisationsFetching = useSelector(getFetchingOrganisations);
  const fetchorgs = useCallback(props.fetchorgs, []);
  const initialise = useCallback(props.initialise, []);

  useEffect(() => {
    fetchorgs();
    initialise();
  }, [initialise, fetchorgs])

  const renderProjects = () => {
    if (organisationsFetching) {
      return <CircularProgress color="secondary" />
    } return (
      <>
        < Select
          value={activeOrg || ""}
          onChange={(e) => props.setactiveorg(String(e.target.value))}
          className={clsx(classes.selectInput)}
          inputProps={{
            classes: {
              root: classes.border,
              icon: classes.icon,
            },
          }}
        >
          {organisations.map(org => <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>)}
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

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch: any) => ({ //TODO: add type checking to dispatch
  fetchorgs: () => dispatch(fetchOrgs()),
  setactiveorg: (orgId: string) => dispatch(setActiveOrg(orgId)),
  initialise: () => dispatch(initialise())
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

interface CustomAppbarProps extends PropsFromRedux, AppBarProps {
  onMenuClick: () => void;
}

export default connector(CustomAppbar);