import { EResponseOptionTypes, IHyperlinkOption, IImageOption, IIntent, IResponseOption } from '@bavard/agent-config';
import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React, { useMemo } from 'react';
import { DropDown, TextInput } from '../../../components';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(3),
      paddingRight: theme.spacing(4),
      paddingBottom: theme.spacing(3),
      paddingLeft: theme.spacing(4),
    },
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

interface EditOptionProps {
  intents: IIntent[];
  option: IResponseOption;
  onEditOption: (option: IResponseOption) => void;
}

const EditOption = ({
  intents,
  option,
  onEditOption,
}: EditOptionProps) => {
  const classes = useStyles();

  const OptionTypes = [EResponseOptionTypes.TEXT, EResponseOptionTypes.HYPERLINK, EResponseOptionTypes.IMAGE].map(type => ({
    id: type,
    name: type,
  }));

  const isIntentRequired = option.type !== EResponseOptionTypes.HYPERLINK;
  const isHyperLinkOption = option.type === EResponseOptionTypes.HYPERLINK;
  const isImageOption = option.type === EResponseOptionTypes.IMAGE;

  const allIntents = useMemo(() => {
    return intents.map((intent) => ({
      id: intent.name,
      name: intent.name,
    }));
  }, [intents]);

  return (
    <Grid container={true} className={classes.root}>
      <Grid container={true} item={true} sm={12} className={classes.formField}>
        <TextInput
          fullWidth={true}
          label="Option Name"
          value={option.text || ''}
          className={classes.input}
          onChange={(e) => onEditOption({
            ...option,
            text: e.target.value,
          } as IResponseOption)}
        />
      </Grid>
      <Grid container={true} item={true} sm={12} className={classes.formField}>
        <DropDown
          fullWidth={true}
          label="Option Type"
          labelPosition="left"
          menuItems={OptionTypes}
          current={option.type}
          padding="12px"
          onChange={(type) => onEditOption({
            ...option,
            type,
          } as IResponseOption)}
        />
      </Grid>
      {isHyperLinkOption && (
        <Grid container={true} item={true} className={classes.formField}>
          <TextInput
            fullWidth={true}
            label="Hyperlink Target"
            value={(option as IHyperlinkOption).targetLink || ''}
            className={classes.input}
            onChange={(e) =>
              onEditOption({
                ...option,
                targetLink: e.target.value,
              } as IHyperlinkOption)
            }
          />
        </Grid>
      )}
      {isIntentRequired && (
        <Grid container={true} item={true} className={classes.formField}>
          <DropDown
            fullWidth={true}
            label="Option Intent"
            labelPosition="left"
            menuItems={allIntents}
            current={option.intent}
            padding="12px"
            onChange={(intent) => onEditOption({
              ...option,
              intent,
            } as IResponseOption)}
          />
        </Grid>
      )}
      {isImageOption && (
        <>
          <Grid container={true} item={true} className={classes.formField}>
            <TextInput
              fullWidth={true}
              label="Image Name"
              value={(option as IImageOption).imageName || ''}
              className={classes.input}
              onChange={(e) => onEditOption({
                ...option,
                imageName: e.target.value,
              } as IResponseOption)}
            />
          </Grid>
          <Grid container={true} item={true} className={classes.formField}>
            <TextInput
              fullWidth={true}
              label="Image Caption"
              value={(option as IImageOption).caption || ''}
              className={classes.input}
              onChange={(e) => onEditOption({
                ...option,
                caption: e.target.value,
              } as IResponseOption)}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default EditOption;
