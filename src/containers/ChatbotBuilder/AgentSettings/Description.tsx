import { IWidgetSettings } from '@bavard/agent-config';
import { Grid, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    description: {
      padding: '10px',
      fontSize: '14px',
    },
    inputField: {
      marginBottom: '40px',
      padding: '0px',
    },
    textAreaField: {
      padding: '0px',
    },
  }),
);

interface DescriptionProps {
  mode: string;
  loading: boolean;
  settings: IWidgetSettings;
  updateSettings: (field: keyof IWidgetSettings, value: any) => void;
}

export const Description = ({
  mode,
  loading,
  settings,
  updateSettings,
}: DescriptionProps) => {
  const classes = useStyles();
  return (
    <div>
      <Grid className={classes.inputField}>
        <Typography style={{ marginBottom: '10px' }}>Assistant Name</Typography>
        <TextField
          label=""
          disabled={loading || mode === 'published'}
          fullWidth={true}
          variant="outlined"
          value={settings.name}
          onChange={(e) => updateSettings('name', e.target.value)}
          inputProps={{ className: classes.description }}
        />
      </Grid>
      <Grid className={classes.inputField}>
        <Typography style={{ marginBottom: '10px' }}>Greeting Title</Typography>
        <TextField
          label=""
          disabled={loading || mode === 'published'}
          fullWidth={true}
          variant="outlined"
          value={settings.title}
          onChange={(e) => updateSettings('title', e.target.value)}
          inputProps={{ className: classes.description }}
        />
      </Grid>
      <Grid className={classes.inputField}>
        <Typography style={{ marginBottom: '10px' }}>
          Greeting Subtitle
        </Typography>
        <TextField
          label=""
          disabled={loading || mode === 'published'}
          fullWidth={true}
          multiline={true}
          variant="outlined"
          rows={3}
          value={settings.subtitle}
          onChange={(e) => updateSettings('subtitle', e.target.value)}
          inputProps={{ className: classes.textAreaField }}
        />
      </Grid>
    </div>
  );
};
