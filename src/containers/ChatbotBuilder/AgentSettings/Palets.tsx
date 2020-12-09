import { IWidgetSettings } from '@bavard/agent-config';
import { GradientPicker } from '@bavard/react-components';
import { Box, Grid, Typography } from '@material-ui/core';
import { size } from 'lodash';
import React from 'react';
import { AlphaPicker, TwitterPicker } from 'react-color';

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
                  colors={[
                    '#FD6A21',
                    '#FBB82B',
                    '#7FDBB6',
                    '#21CF86',
                    '#91D2FA',
                    '#1B95E0',
                    '#979797',
                    '#DB2317',
                    '#127D78',
                  ]}
                  onChange={(color) =>
                    updateSettings('primaryColor', color.rgb)
                  }
                />
              )}
            </Box>
          </Grid>
        </Grid>
        <Box mt={4} mb={4} mx="auto">
          {mode === 'dev' && (
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
              }}>
              <Typography style={{ marginRight: '10px' }}>Opacity: </Typography>
              <AlphaPicker
                color={settings.primaryColor}
                onChange={(color) => updateSettings('primaryColor', color.rgb)}
              />
            </Box>
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
