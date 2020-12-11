import React, { useEffect, useState } from 'react';
import { AgentConfig } from '@bavard/agent-config';
import { Button } from '@bavard/react-components';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';

const PrettoSlider = withStyles({
  root: {
    color: 'rgb(74, 144, 226)',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  mark: {
    display: 'none',
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const AssistantConfigurations = () => {
  const [config, setConfig] = useRecoilState<AgentConfig | undefined>(
    currentAgentConfig,
  );

  let marks = new Array(10).fill(0);
  marks = marks.map((_, index: number) => ({
    value: index / 10,
    label: index / 10,
  }));

  if (!config) {
    return <Typography>No Assistant Configuration at the moment.</Typography>;
  }

  const onChangeThreshold = (_: any, value: number | number[]) => {
    const threshold = Array.isArray(value) ? value[0] : value;
    const newConfig = config.copy();
    newConfig.intentConfidenceThreshold = threshold;
    setConfig(newConfig);
  };

  return (
    <Box width={1} height="calc(100% - 16)" overflow="hidden" padding={2}>
      <Typography id="discrete-slider-always" align="left" gutterBottom>
        Confidence Threshold
      </Typography>
      <PrettoSlider
        min={0}
        max={1}
        step={0.01}
        aria-label="pretto slider"
        valueLabelDisplay="auto"
        value={config.intentConfidenceThreshold}
        marks={marks}
        defaultValue={1}
        onChange={onChangeThreshold}
      />
    </Box>
  );
};

export default AssistantConfigurations;
