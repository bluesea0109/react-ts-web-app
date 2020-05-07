
import { Button, Card, createStyles, LinearProgress, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import clsx from "clsx";
import React, { useState } from "react";
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { createProject } from "../../store/projects/actions";
import { getNewProjectLoader } from "../../store/projects/selector";
import { getActiveOrg } from "../../store/selectors";

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

function NewProject(props: NewProjectProps) {
    const classes = useStyles();
    const [state, setState] = useState({
        name: ""
    });
    const projectLoader = useSelector(getNewProjectLoader);
    const activeOrg = useSelector(getActiveOrg);
    const submit = () => {
        props.createProject(state.name, String(activeOrg));
    }

    return (
        <Card className={clsx(classes.root)}>
            {projectLoader && <LinearProgress />}
            <Typography variant="h4">{"New Project"}</Typography>
            <br />
            <TextField
                id="name"
                label="Project Name"
                type="string"
                value={state.name || ''}
                variant="outlined"
                onChange={(e: any) => setState({ ...state, name: (e.target.value) })}
                className={clsx(classes.inputBox)}
            />
            <br />
            <Button className={clsx(classes.button)} disabled={projectLoader} variant="contained" color="primary" onClick={submit}>{"Submit"}</Button>
        </Card>
    )
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: any) => ({
    createProject: (name: string, orgId: string) => dispatch(createProject(name, orgId)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type NewProjectProps = ConnectedProps<typeof connector>

export default connector(NewProject)
