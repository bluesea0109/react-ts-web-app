import { Box, Typography } from '@material-ui/core';
import React from 'react';

interface TabPanelProps {
  index?: any;
  value?: any;
  tabName?: string;
  padding?: number;
  className?: string;
  children?: React.ReactNode;
}

const TabPanel = ({
  index,
  value,
  children,
  tabName,
  className,
  padding,
}: TabPanelProps) => {
  if (value !== index) {
    return null;
  }

  const tabPadding = padding || 6;
  return (
    <Box
      className={className}
      paddingX={tabPadding}
      paddingBottom={tabPadding}
      paddingTop={tabName ? 0 : tabPadding}>
      {tabName && (
        <Box paddingY={2}>
          <Typography variant="h5" style={{ fontWeight: 'bold' }}>
            {tabName}
          </Typography>
        </Box>
      )}
      {children}
    </Box>
  );
};

export default TabPanel;
