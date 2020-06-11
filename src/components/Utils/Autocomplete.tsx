import React, { Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


interface IComboBoxProps {
    value: string | number | null;
    label:string;
    onChange:any;
    options: any[] | undefined;
  }
const ComboBox: React.FC<IComboBoxProps> = ({value, onChange, label, options}) => {
  if (options) {
    return (
      <Autocomplete
        onChange={onChange}
        id={`${label}-demo`}
        renderOption={(option) => <Fragment>{option.value}</Fragment>}
        getOptionLabel={(option) => option.value}
        options={options}
        style={{ width: '100%' }}
        renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
      />
    );
  } else {
    return null;
  }
  
}

export default ComboBox;