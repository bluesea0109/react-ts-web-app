import { IAgentFormAction, IFormField } from '@bavard/agent-config';
import { EFormFieldTypes } from '@bavard/agent-config/dist/enums';
import { TextInput, CommonTable } from '@bavard/react-components';
import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  TableCell,
  Theme,
  withStyles,
} from '@material-ui/core';
import React, { useState } from 'react';
import FormFieldRow from './FormFieldRow';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formField: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    input: {
      '& .MuiOutlinedInput-input': {
        padding: '12px 12px',
      },
    },
  }),
);

const TableHeaderCell = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    border: '1px solid',
    borderColor: theme.palette.divider,
  },
}))(TableCell);

interface EditFormActionProps {
  action: IAgentFormAction;
  onChangeAction: (action: IAgentFormAction) => void;
}

const EditFormAction = ({ action, onChangeAction }: EditFormActionProps) => {
  const classes = useStyles();
  const [editingFieldIndex, setEditingFieldIndex] = useState(-1);

  const onAddField = () => {
    onChangeAction({
      ...action,
      fields: [
        ...action.fields,
        {
          name: '',
          type: EFormFieldTypes.TEXT,
          required: false,
        } as IFormField,
      ],
    });
    setEditingFieldIndex(action.fields.length);
  };

  const onUpdateField = (index: number, field: IFormField) => {
    onChangeAction({
      ...action,
      fields: [
        ...action.fields.slice(0, index),
        field,
        ...action.fields.slice(index + 1),
      ],
    });
  };

  const onDeleteField = (index: number) => {
    onChangeAction({
      ...action,
      fields: action.fields.filter((_, i) => i !== index),
    });
  };

  const columns = [
    { title: 'Form Filed Name', field: 'name' },
    { title: 'Form Field Type', field: 'type' },
    { title: 'Required?', field: 'required' },
    { title: 'Delete' },
  ];

  return (
    <>
      <Grid container={true} item={true} sm={12} className={classes.formField}>
        <TextInput
          fullWidth={true}
          label="Form Url"
          value={action.url || ''}
          className={classes.input}
          onChange={(e) => onChangeAction({ ...action, url: e.target.value })}
        />
      </Grid>
      <Grid
        container={true}
        item={true}
        sm={12}
        className={classes.formField}
        justify="flex-end">
        <Button
          autoFocus={true}
          color="primary"
          variant="contained"
          onClick={onAddField}>
          Add Field
        </Button>
      </Grid>
      <Grid container={true} className={classes.formField}>
        <CommonTable
          data={{
            columns,
            rowsData: action.fields,
          }}
          components={{
            TableHeaderCell,
            TableRow: ({ rowData, rowIndex }) => (
              <FormFieldRow
                field={rowData}
                isEditing={editingFieldIndex === rowIndex}
                onClick={() => setEditingFieldIndex(rowIndex)}
                onDeleteField={() => onDeleteField(rowIndex)}
                onUpdateField={(field) => onUpdateField(rowIndex, field)}
              />
            ),
          }}
        />
      </Grid>
    </>
  );
};

export default EditFormAction;
