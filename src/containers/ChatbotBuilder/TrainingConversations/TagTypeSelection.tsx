import { TextInput } from '@bavard/react-components';
import { Button, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { Fragment, useState } from 'react';

interface ITagSelection {
  tags: any[];
  onAddTags: (tagType: string, tagValue: string, index: number) => any;
  userTags: any;
  index: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    controlsWidth: {
      width: '20%',
      padding: '0px 3px',
      minWidth: '130px',
    },
    tagSelectionWrapper: {
      alignItems: 'center',
    },
  }),
);

const TagTypeSelection: React.FC<ITagSelection> = ({
  tags,
  onAddTags,
  userTags,
  index,
}) => {
  const classes = useStyles();
  const [tagSelectedValue, setTagSelectedValue] = useState<string | null>(
    tags[0],
  );
  const [tagValue, setTagValues] = useState<any | null>('');

  function _onTagAdd() {
    onAddTags(tagSelectedValue || '', tagValue, index);
    setTagValues('');
    setTagSelectedValue(null);
  }

  return (
    <Fragment>
      <Grid container={true} className={classes.tagSelectionWrapper}>
        <Grid item={true} className={classes.controlsWidth}>
          <Autocomplete
            options={tags.filter(
              (o) => !userTags?.find((o2: any) => o.value === o2.tagType),
            )}
            value={tagSelectedValue}
            getOptionLabel={(option) => option}
            onChange={(event: any, newValue: any | null) =>
              setTagSelectedValue(newValue)
            }
            renderInput={(params) => (
              <TextInput
                {...params}
                label="Tag Types"
                labelType="Typography"
                labelPosition="top"
                variant="outlined"
              />
            )}
            size="small"
          />
        </Grid>
        <Grid item={true} className={classes.controlsWidth}>
          <TextInput
            label="Values"
            labelType="Typography"
            labelPosition="top"
            variant="outlined"
            id="tagValues"
            value={tagValue}
            size="small"
            onChange={(event: any) => setTagValues(event.target.value)}
          />
        </Grid>
        <Button variant="contained" color="primary" onClick={_onTagAdd}>
          Add Tag
        </Button>
      </Grid>
    </Fragment>
  );
};

export default TagTypeSelection;
