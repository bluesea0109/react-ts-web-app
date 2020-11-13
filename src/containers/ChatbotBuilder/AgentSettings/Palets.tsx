import { IWidgetSettings } from '@bavard/agent-config';
import { Box, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { AlphaPicker, TwitterPicker } from 'react-color';
import GradientPicker from '../../../components/GradientPicker';

interface PalleteProps {
  mode: string;
  loading: boolean;
  settings: IWidgetSettings;
  updateSettings: (field: keyof IWidgetSettings, value: any) => void;
}

export const ColorPalett = ({
  mode,
  loading,
  settings,
  updateSettings,
}: PalleteProps) => {
  return (
    <div>
      <div>
        <Typography>Widget Primary Color</Typography>
        <Grid
          container={true}
          style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid item={true} sm={6}>
            <Box
              style={{
                height: '100px',
                backgroundColor:
                  typeof settings.primaryColor === 'string'
                    ? settings.primaryColor
                    : `rgba(${settings.primaryColor.r}, ${settings.primaryColor.g}, ${settings.primaryColor.b}, ${settings.primaryColor.a})`,
              }}
            />
          </Grid>
          <Grid item={true} sm={4}>
            <Box style={{ marginLeft: '20px' }}>
              {mode === 'dev' && (
                <TwitterPicker
                  triangle="hide"
                  color={settings.primaryColor}
                  onChange={(color) =>
                    updateSettings('primaryColor', color.rgb)
                  }
                />
              )}
            </Box>
          </Grid>
        </Grid>
        <Box mt={4} mb={1} mx="auto">
          {mode === 'dev' && (
            <AlphaPicker
              color={settings.primaryColor}
              onChange={(color) => updateSettings('primaryColor', color.rgb)}
            />
          )}
        </Box>

        <Typography>Widget Background Color</Typography>
        <Grid container={true}>
          <GradientPicker
            defaultValue={settings?.widgetBg}
            label=""
            onChange={(gradient) => updateSettings('widgetBg', gradient)}
          />
        </Grid>
      </div>
    </div>
  );
};
