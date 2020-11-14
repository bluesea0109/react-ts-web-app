import { IWidgetSettings } from '@bavard/agent-config';
import { Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import ImageUploader from './ImageUploader';

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
    avatarPos: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);

interface LogoProps {
  title: string;
  mode: string;
  loading: boolean;
  settings: IWidgetSettings;
  updateSettings: (field: keyof IWidgetSettings, value: any) => void;
}

export const Logo = ({
  title,
  mode,
  loading,
  settings,
  updateSettings,
}: LogoProps) => {
  const classes = useStyles();
  return (
    <div>
      <Grid container={true}>
        <Grid item={true} sm={12} className={classes.avatarPos}>
          {title}
        </Grid>
        <Grid item={true} sm={12} className={classes.avatarPos}>
          <ImageUploader
            isLoading={loading || mode === 'published'}
            currentImage={settings.logoUrl}
            label="Brand Logo"
            onImageUpload={(url: string) => updateSettings('logo', url)}
            iconType="LOGO"
          />
        </Grid>
      </Grid>
    </div>
  );
};
