
import { Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import "firebase/auth";
import React from "react";
import { useDispatch } from "react-redux";
import NewOrganisation from "./NewOrganisation";
const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    })
);
function Account() {
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <>
            <Typography variant="h4">{"Accounts section"}</Typography>
            <NewOrganisation />
        </>
    );
}
export default Account;