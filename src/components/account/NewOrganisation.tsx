
import { Button, Card, createStyles, LinearProgress, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import clsx from "clsx";
import React, { useState } from "react";
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { createOrg } from "../../store/organisations/actions";
import { getNewOrgLoader } from "../../store/organisations/selector";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    inputBox: {
      margin: theme.spacing(1),
    },
    button: {
      margin: theme.spacing(1),
    }
  })
);

function NewOrganisation(props: NewOrganisationProps) {
  const classes = useStyles();
  const [state, setState] = useState({
    name: ""
  });
  const orgLoader = useSelector(getNewOrgLoader)
  const submit = () => {
    props.createOrg(state.name);
  }

  return (
    <Card className={clsx(classes.root)}>
      {orgLoader && <LinearProgress />}
      <Typography variant="h4">{"New Organisation"}</Typography>
      <br />
      <TextField
        id="name"
        label="Organisation Name"
        type="string"
        value={state.name || ''}
        variant="outlined"
        onChange={(e: any) => setState({ ...state, name: (e.target.value) })}
        className={clsx(classes.inputBox)}
      />
      <br />
      <Button className={clsx(classes.button)} disabled={orgLoader} variant="contained" color="primary" onClick={submit}>{"Submit"}</Button>
    </Card>
  )
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch: any) => ({
  createOrg: (name: string) => dispatch(createOrg(name)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type NewOrganisationProps = ConnectedProps<typeof connector>

export default connector(NewOrganisation)
