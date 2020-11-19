import { Box, Typography, makeStyles } from '@material-ui/core';
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

  const classes = useStyles();

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
        <Typography className={classes.pageTitle}>{tabName}</Typography>
      )}
      {children}
    </Box>
  );
};

const useStyles=makeStyles((theme) => ({
  pageTitle: {
    fontSize: '26px', 
    marginBottom: '24px'
  }
}))

export default TabPanel;
