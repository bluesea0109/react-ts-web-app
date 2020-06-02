import { Typography } from "@material-ui/core";
import React from "react";
import { IUser } from "../../../models";

interface IOrgSettingsProps {
  user: IUser;
}

export default function OrganizationSettings(props: IOrgSettingsProps) {
  return <Typography>{"Org"}</Typography>
}