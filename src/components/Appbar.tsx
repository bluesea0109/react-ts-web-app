import { CircularProgress, createStyles, IconButton, Theme } from '@material-ui/core';
import AppBar, { AppBarProps } from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { AppState } from '../store';
import { setActiveOrg } from "../store/auth/actions";
import { fetchOrgs } from "../store/organisations/actions";
import { selectOrganisationFetching, selectOrganisations } from "../store/organisations/selector";
import { OrgType } from '../store/organisations/types';
import { selectActiveOrg } from '../store/selectors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

function CustomAppbar(props: CustomAppbarProps) {
  const classes = useStyles();

  useEffect(() => {
    props.fetchOrgs()
  }, [])

  const renderProjects = () => {
    if (props.organisationsFetching) {
      return <CircularProgress color="secondary" />
    } return (
      <>
        < Select
          value={props.activeOrg}
          onChange={(e) => props.setActiveOrg(String(e.target.value))
          }
        >
          {props.organisations.map(org => <MenuItem value={org.id}>{org.name}</MenuItem>)}
        </Select >
      </>
    )
  }

  return (
    <AppBar
      {...props}
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

type PropsType = {
  organisations: Array<OrgType>,
  organisationsFetching: boolean,
  activeOrg: string | null
}

const mapStateToProps = () => createStructuredSelector<AppState, PropsType>({
  organisations: selectOrganisations,
  organisationsFetching: selectOrganisationFetching,
  activeOrg: selectActiveOrg
});

const mapDispatchToProps = (dispatch: any) => ({ //TODO: add type checking to dispatch
  fetchOrgs: () => dispatch(fetchOrgs()),
  setActiveOrg: (orgId: string) => dispatch(setActiveOrg(orgId))
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

interface CustomAppbarProps extends AppBarProps, PropsFromRedux {
  onMenuClick: () => void;
}

export default connector(CustomAppbar);