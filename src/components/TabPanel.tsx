import { Box } from '@material-ui/core';
import React from 'react';

interface TabPanelProps {
  className?: string;
  children?: React.ReactNode;
  dir?: string;
  index?: any;
  value?: any;
}

const TabPanel = ({
  className,
  children,
  dir,
  index,
  value,
  ...other,
}: TabPanelProps) => {
  return (
    <div
      className={className}
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box paddingX={2} paddingY={1}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
