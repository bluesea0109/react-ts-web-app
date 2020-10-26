import { FormAction, IFormField } from '@bavard/agent-config';
import { createStyles, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, withStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { TextInput } from '../../../components';
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

const TabelHeaderCell = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    border: '1px solid',
    borderColor: theme.palette.divider,
  },
}))(TableCell);

interface EditFormActionProps {
  action: FormAction;
  onChangeAction: (field: string, value: any) => void;
}

const EditFormAction = ({
  action,
  onChangeAction,
}: EditFormActionProps) => {
  const classes = useStyles();
  const [editingFieldIndex, setEditingFieldIndex] = useState(-1);

  const onUpdateField = (index: number, field: IFormField) => {
    onChangeAction('fields', [
      ...action.fields.slice(0, index),
      field,
      ...action.fields.slice(index + 1),
    ]);
  };

  const onDeleteField = (index: number) => {
    onChangeAction('fields', action.fields.filter((_, i) => i !== index));
  };

  return (
    <>
      <Grid container={true} item={true} sm={12} className={classes.formField}>
        <TextInput
          fullWidth={true}
          label="Form Url"
          value={action.url || ''}
          className={classes.input}
          onChange={e => onChangeAction('url', e.target.value)}
        />
      </Grid>
      <Grid container={true} className={classes.formField}>
        <TableContainer>
          <Table aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TabelHeaderCell align="left">Form Filed Name</TabelHeaderCell>
                <TabelHeaderCell align="center">Form Field Type</TabelHeaderCell>
                <TabelHeaderCell align="center">Required?</TabelHeaderCell>
                <TabelHeaderCell align="center">Delete</TabelHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {action.fields.map((field, index) =>
                <FormFieldRow
                  key={index}
                  field={field}
                  isEditing={editingFieldIndex === index}
                  onClick={() => setEditingFieldIndex(index)}
                  onDeleteField={() => onDeleteField(index)}
                  onUpdateField={(field) => onUpdateField(index, field)}
                />,
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default EditFormAction;
