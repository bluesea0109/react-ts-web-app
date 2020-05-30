import {
  createStyles,
  FormControl,
  FormGroup,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState } from 'react';
import { ICategory, ICategorySet } from '../../../../models';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    img: {
      maxHeight: 300,
      maxWidth: '100%',
      objectFit: 'scale-down',
      verticalAlign: 'bottom',
      display: 'block',
      margin: 'auto',
    },
    imgContainer: {
      textAlign: 'center',
      display: 'inline-block',
    },
    root: {
      flex: '1 1 0',
      textAlign: 'center',
      padding: theme.spacing(1),
    },
    formControl: {
      minWidth: 150,
    },
    formGroup: {
      minWidth: 150,
      display: 'inline-block',
    },
  }),
);

interface IImageTileProps {
  categorySets: ICategorySet[];
  imageUrl: string;
  activeCategorySet: ICategorySet | null;
  activeCategory: ICategory | null;
}

interface IState {
  categorySet: null | ICategorySet;
  selectedCategory: null | ICategory;
}

export default function ImageTile(props: IImageTileProps) {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    categorySet: props.activeCategorySet,
    selectedCategory: props.activeCategory,
  });

  const onImageClick = () => {
    setState({
      ...state,
      categorySet: props.activeCategorySet,
      selectedCategory: props.activeCategory,
    });
  };

  if (props.imageUrl === '') {
    return <div className={classes.root} />;
  }

  const handleSelectCategory = (categorySet: ICategorySet | null) => (
    e: React.ChangeEvent<{}>,
    value: {
      value: string;
      label: string;
    } | null,
  ) => {
    if (!categorySet) {
      return;
    }

    const category = categorySet.categories.find(
      (x) => x.name === value?.value,
    );
    if (!category) {
      return;
    }

    setState({
      ...state,
      selectedCategory: category,
    });
  };

  const categorySetOptions =
    props.categorySets?.map((x) => ({
      value: x.id,
      label: x.name,
    })) || [];

  const categoryOptions = state.categorySet
    ? state.categorySet.categories.map((x) => ({
        value: x.name,
        label: x.name,
      }))
    : [];

  return (
    <div className={classes.root}>
      <div className={classes.imgContainer}>
        <img
          className={classes.img}
          src={props.imageUrl}
          alt="batch"
          onClick={onImageClick}
        />
        <FormGroup row={true} className={classes.formGroup}>
          <FormControl className={classes.formControl}>
            <Autocomplete
              options={categorySetOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category Set"
                  variant="filled"
                />
              )}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <Autocomplete
              value={{
                value: state.selectedCategory?.name || '',
                label: state.selectedCategory?.name || '',
              }}
              onChange={handleSelectCategory(state.categorySet)}
              options={categoryOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField {...params} label="Category" variant="filled" />
              )}
            />
          </FormControl>
        </FormGroup>
      </div>
    </div>
  );
}
