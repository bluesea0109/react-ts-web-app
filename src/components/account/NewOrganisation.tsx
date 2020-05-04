
import { Button, createStyles, makeStyles, TextField, Theme } from '@material-ui/core';
import React, { useState } from "react";
import { connect, ConnectedProps } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { AppState } from '../../store';
import { createOrg } from "../../store/organisations/actions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
  })
);

function NewOrganisation(props: NewOrganisationProps) {

  const [state, setState] = useState({
    name: ''
  });

  const submit = () => {
    props.createOrg(state.name);
  }

  return (
    <div>
      New Organisations
      <br />
      <TextField
        id="name"
        label="Organisation Name"
        type="string"
        variant="outlined"
        onChange={(e: any) => setState({ ...state, name: (e.target.value) })}
      />
      <br />
      <Button variant="contained" color="primary" onClick={submit}>{"Submit"}</Button>
    </div>
  )
}

type PropsType = {

}

const mapStateToProps = () => createStructuredSelector<AppState, PropsType>({

});

const mapDispatchToProps = (dispatch: any) => ({
  createOrg: (name: string) => dispatch(createOrg(name)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
interface NewOrganisationProps extends PropsFromRedux {

}

export default connector(NewOrganisation)
