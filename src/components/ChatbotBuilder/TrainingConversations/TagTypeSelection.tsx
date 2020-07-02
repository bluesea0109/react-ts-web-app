import { Grid, IconButton, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AddCircleOutline } from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { Fragment, useState } from 'react';
import { ITagType } from '../../../models/chatbot-service';

interface ITagSelection {
  tags: any[];
  onAddTags: (tagType: string, tagValue: string) => any;
  userTags:  any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    controlsWidth: {
      width: '20%',
      padding: '0px 3px',
      minWidth: '130px',
    },
}));

const TagTypeSelection: React.FC<ITagSelection> = ({tags, onAddTags, userTags}) => {
  const classes = useStyles();
  const [tagSelectedValue, setTagSelectedValue] = React.useState<ITagType | null>(null);
  const [tagValue, setTagValues] = useState<any | null>(null);

  function _onTagAdd() {
    onAddTags(tagSelectedValue?.value || '', tagValue);
    setTagValues('');
    setTagSelectedValue(null);
  }

  return (
      <Fragment>
        <Grid item={true} className={classes.controlsWidth}>
          <Autocomplete
            options={tags.filter(o => !userTags?.find((o2: any) => o.value === o2.tagType))}
            value={tagSelectedValue}
            getOptionLabel={(option) =>  option.value}
            onChange={(event: any, newValue: any | null) => setTagSelectedValue(newValue)}
            renderInput={(params) => <TextField {...params} label="Tag Types" variant="outlined" />}
          />
        </Grid>
        <Grid item={true} className={classes.controlsWidth}>
          <TextField
            label="Values"
            variant="outlined"
            id="tagValues"
            value={tagValue}
            onChange={(event: any) => setTagValues(event.target.value)}
          />
        </Grid>
        <IconButton onClick={_onTagAdd}>
          <AddCircleOutline fontSize="large" />
        </IconButton>
      </Fragment>
  );
};

export default TagTypeSelection;
