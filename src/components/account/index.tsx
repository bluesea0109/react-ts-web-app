
import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import "firebase/auth";
import React from "react";
import NewOrganisation from "./NewOrganisation";
import NewProject from "./NewProject";
import Projects from './Projects';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3),
        }
    })
);
function Account() {
    const classes = useStyles();
    return (
        <>
            <Typography variant="h4">{"Accounts section"}</Typography>
            <div className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <NewOrganisation />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <NewProject />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Projects />
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
export default Account;