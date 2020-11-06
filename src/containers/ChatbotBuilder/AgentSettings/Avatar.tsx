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
  }),
);

interface AvatarProps {
  mode: string;
  loading: boolean;
  settings: IWidgetSettings;
  updateSettings: (field: keyof IWidgetSettings, value: any) => void;
}

export const Avatar = ({mode, loading, settings, updateSettings}: AvatarProps) => {
  const classes = useStyles();
  return (
    <div>
      <Grid container={true}>
        <Grid item={true} sm={12}>
          Widget Avatar
        </Grid>
        <Grid item={true} sm={12}>
          <ImageUploader
            isLoading={loading || mode === 'published'}
            currentImage={settings.avatarUrl}
            label="Widget Avatar"
            onImageUpload={(url: string) => updateSettings('avatar', url)}
            iconType="AVATAR"
          />
        </Grid>
        <Grid item={true} sm={12}>
          Upload a Different Image
        </Grid>
      </Grid>
    </div>
  );
};
