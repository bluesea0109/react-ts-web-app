import { EFormFieldTypes, IFormField } from '@bavard/agent-config';
import { Checkbox, createStyles, makeStyles, TableCell, TableRow, Theme, withStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import React from 'react';
import { DropDown, TextInput } from '../../../components';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      '& .MuiOutlinedInput-input': {
        padding: '8px 8px',
      },
    },
  }),
);

const StripedTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const NoPaddingCell = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    borderLeft: '1px solid',
    borderLeftColor: theme.palette.divider,
    borderRight: '1px solid',
    borderRightColor: theme.palette.divider,
  },
}))(TableCell);

interface FormFieldRowProps {
  field: IFormField;
  onDeleteField: () => void;
  onUpdateField: (field: IFormField) => void;
}

const FormFieldRow = ({
  field,
  onDeleteField,
  onUpdateField,
}: FormFieldRowProps) => {
  const classes = useStyles();

  const FormFieldTypes = [EFormFieldTypes.EMAIL, EFormFieldTypes.PHONE, EFormFieldTypes.TEXT, EFormFieldTypes.ZIP].map(type => ({
    id: type,
    name: type,
  }));

  return (
    <StripedTableRow>
      <NoPaddingCell align="left">
        <TextInput
          fullWidth={true}
          variant="outlined"
          value={field.name}
          className={classes.input}
          onChange={e => onUpdateField({ ...field, name: e.target.value})}
        />
      </NoPaddingCell>
      <NoPaddingCell align="left">
        <DropDown
          fullWidth={true}
          menuItems={FormFieldTypes}
          current={field.type}
          onChange={(type) => onUpdateField({ ...field, type} as any)}
        />
      </NoPaddingCell>
      <NoPaddingCell align="center">
        <Checkbox
          checked={field.required}
          onChange={() => onUpdateField({ ...field, required: !field.required})}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </NoPaddingCell>
      <NoPaddingCell align="right">
        <Delete onClick={onDeleteField} />
      </NoPaddingCell>
    </StripedTableRow>
  );
};

export default FormFieldRow;
