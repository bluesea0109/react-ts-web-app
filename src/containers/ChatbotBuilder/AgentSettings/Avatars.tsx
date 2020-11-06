import { IWidgetSettings } from '@bavard/agent-config';
import { Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { Avatar } from './Avatar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

// (e) => updateSettings('name', e.target.value)}
interface AvatarsProps {
  mode: string;
  loading: boolean;
  settings: IWidgetSettings;
  updateSettings: (field: keyof IWidgetSettings, value: any) => void;
}

export const Avatars = ({mode, loading, settings, updateSettings}: AvatarsProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container={true}>
        <Grid item={true} xs={12} sm={6}>
          <Avatar  mode={mode} loading={loading} settings={settings} updateSettings={updateSettings }/>
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <Avatar  mode={mode} loading={loading} settings={settings} updateSettings={updateSettings }/>
        </Grid>
      </Grid>
    </div>
  );
};
