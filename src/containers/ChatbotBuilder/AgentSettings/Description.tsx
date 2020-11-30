import { IWidgetSettings } from '@bavard/agent-config';
import { TextInput } from '@bavard/react-components';
import { Grid } from '@material-ui/core';
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
        <TextInput
          label="Assistant Name"
          labelType="Typography"
          labelPosition="top"
          disabled={loading || mode === 'published'}
          fullWidth={true}
          variant="outlined"
          value={settings.name}
          onChange={(e) => updateSettings('name', e.target.value)}
          inputProps={{ className: classes.description }}
        />
      </Grid>
      <Grid className={classes.inputField}>
        <TextInput
          label="Greeting Title"
          labelType="Typography"
          labelPosition="top"
          disabled={loading || mode === 'published'}
          fullWidth={true}
          variant="outlined"
          value={settings.title}
          onChange={(e) => updateSettings('title', e.target.value)}
          inputProps={{ className: classes.description }}
        />
      </Grid>
      <Grid className={classes.inputField}>
        <TextInput
          label="Greeting Subtitle"
          labelType="Typography"
          labelPosition="top"
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
