import { EFormFieldTypes } from '@bavard/agent-config/dist/';
import {
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Add from '@material-ui/icons/Add';
import React, { useState } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    niceform: {
      flexGrow: 1,
      alignItems: 'center',
      border: '1px solid gray',
      borderRadius: '5px',
      borderStyle: 'dashed',
      padding: '30px',
      marginBottom: '20px',
    },
    button: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: 'gray',
      color: 'white',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
);

interface AddFormFieldProps {
  handleChange: (name: string, type: EFormFieldTypes) => void;
}

export const AddFieldForm = ({ handleChange }: AddFormFieldProps) => {
  const classes = useStyles();
  const [fields, setFields] = useState<{ text: string; type: EFormFieldTypes }>(
    {
      text: '',
      type: EFormFieldTypes.EMAIL,
    },
  );

  const handleAdd = () => {
    handleChange(fields.text, fields.type);
  };

  const handleFieldChange = (event: any) => {
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className={classes.niceform}>
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={true}>
          <TextField
            id="standard-basic"
            variant="outlined"
            name="text"
            label="Field Name"
            size="small"
            className={classes.formControl}
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item={true} xs={true}>
          <FormControl className={classes.formControl} size="small">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={fields.type}
              name="type"
              variant="outlined"
              onChange={handleFieldChange}>
              {Object.keys(EFormFieldTypes).map((item, index) => (
                <MenuItem value={item} key={index}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={5} />
        <Grid item={true} xs={2}>
          <IconButton onClick={handleAdd}>
            <Add />
          </IconButton>
        </Grid>
        <Grid item={true} xs={5} />
      </Grid>
    </div>
  );
};
