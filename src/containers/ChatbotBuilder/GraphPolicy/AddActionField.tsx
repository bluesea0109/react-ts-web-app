import { EFormFieldTypes } from '@bavard/agent-config/dist/';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
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
      border: '3px solid gray',
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
    baseLine: {
      alignItems: 'first baseline',
    },
  }),
);

interface AddFormFieldProps {
  handleChange: (name: string, type: EFormFieldTypes, required: boolean) => void;
}

export const AddFieldForm = ({ handleChange }: AddFormFieldProps) => {
  const classes = useStyles();
  const [fields, setFields] = useState<{ text: string; type: EFormFieldTypes; required: boolean }>(
    {
      text: '',
      type: EFormFieldTypes.EMAIL,
      required: false,
    },
  );

  const handleAdd = () => {
    handleChange(fields.text, fields.type, fields.required);
  };

  const handleFieldChange = (event: any) => {
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };

  const handleCheckboxChange = (event: any) => {
    setFields({
      ...fields,
      required: event.target.checked,
    });
  };

  return (
    <div className={classes.niceform}>
      <Grid container={true} spacing={2} className={classes.baseLine}>
        <Grid item={true} xs={true} md={12}>
          <TextField
            id="standard-basic"
            name="text"
            label="Field Name"
            style={{width: '100%'}}
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item={true} xs={true} md={12}>
          <FormControl className={classes.formControl}  style={{width: '100%'}}>
            <InputLabel id="demo-simple-select-label">Field Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={fields.type}
              name="type"

              onChange={handleFieldChange}>
              {Object.keys(EFormFieldTypes).map((item, index) => (
                <MenuItem value={item} key={index}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item={true} md={12}>
          <FormControlLabel
            value="end"
            control={<Checkbox color="primary" checked={fields.required} onChange={handleCheckboxChange}/>}
            label="Required *"
            labelPlacement="end"
          />
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
