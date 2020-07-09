import {
  Box,
  Button, createStyles,
  Grid,
  IconButton, TextField, Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';

interface KeyValueArrayInputValue {
  item: string;
  value: string;
}

interface KeyValueArrayItemProps extends KeyValueArrayInputValue {
  value: string;
  disabled?: boolean;
  onDelete: (key: string) => void;
}

const KeyValueArrayItem = (props: KeyValueArrayItemProps) => {
  const { value, onDelete, disabled } = props;
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box width="100%">
      <Grid container={true} xs={12} alignItems="center">
        <Box mr={isMobile ? 1 : 3} width="40%">
          <Typography style={{ fontWeight: 'bold' }}>{value}</Typography>
        </Box>
        <IconButton onClick={() => onDelete(value)} disabled={disabled}>
          <Delete style={{ color: theme.palette.primary.main }} />
        </IconButton>
      </Grid>
    </Box>
  );
};

const KeyValueArrayItemOptimized = React.memo(KeyValueArrayItem);

interface KeyValueArrayInputProps {
  name: string;
  label: string;
  disabled?: boolean;
  value: string[];
  onChange: any;
  onItemAdd?: any;
  onItemDelete?: any;
}

const KeyValueArrayInput = React.forwardRef((props: KeyValueArrayInputProps, ref: any) => {
  const { name, disabled, onItemAdd, value, onChange } = props;
  const [currentItem, setCurrentItem] = useState<string>('');
  const classes = makeStyles((theme: Theme) =>
    createStyles({
      addBtn: {
        '&:focus': {
          border: `2px solid ${theme.palette.primary.main}`,
        },
      },
    }),
  )();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onDelete = (item: string) => {
    const newValues = [...value];
    newValues.splice(
      newValues.findIndex(val => val === item),
      1,
    );

    onChange({ target: { name, value: [...newValues] } });

    props?.onItemDelete?.();
  };

  const onAdd = () => {
    const newValues = [...value];
    const index = newValues.findIndex(val => val === currentItem);
    if (index === -1) {
      newValues.push(currentItem);
      onChange({ target: { name, value: [...newValues] } });
    }
    setCurrentItem('');

    onItemAdd?.();
  };

  return (
    <Grid xs={12} ref={ref}>
      <Box mb={1}>
        <Grid container={true} direction="row" alignItems="center" xs={12}>
          <Box mr={3} mt={2} mb={1}>
            <Typography variant="h5" color="textPrimary">{props.label}</Typography>
          </Box>
        </Grid>
      </Box>
      <Box mb={3}>
        <Grid container={true} direction="row" alignItems="flex-end" xs={12}>
          <Grid item={true} xs={6} style={{ maxWidth: 200, paddingRight: 8 }}>
            <Box mt={1} width="100%" maxWidth={200} flex={true} flexDirection="column">
              <TextField
                disabled={disabled}
                name={name}
                value={currentItem}
                onChange={e => setCurrentItem(e.target.value)}
              />
            </Box>
          </Grid>
          <Box mt={isMobile ? 2 : 0}>
            <Button
              className={classes.addBtn}
              style={{ height: 43 }}
              variant={'outlined'}
              disabled={(currentItem ?? '') === '' || disabled}
              onClick={onAdd}
            >
              Add
            </Button>
          </Box>
        </Grid>
      </Box>
      {value?.map?.(val => (
        <KeyValueArrayItemOptimized
          key={val}
          item={val}
          value={val}
          onDelete={e => onDelete(val)}
          disabled={disabled}
        />
      ))}
    </Grid>
  );
});

export default React.memo(KeyValueArrayInput);
