import { Theme, makeStyles, createStyles, Select } from '@material-ui/core';
import React from 'react';
import { ICategorySet } from '../../../../models';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    img: {
      maxHeight: 300,
      maxWidth: '100%',
      objectFit: 'scale-down',
      verticalAlign: 'bottom',
      display: 'block',
    },
    imgContainer: {
      textAlign: 'left',
      display: 'inline-block',
    },
    root: {
      flex: '1 1 0',
      textAlign: 'center',
      padding: theme.spacing(1),
    }
  }),
);

interface IImageTileProps {
  categorySets: ICategorySet[];
  imageUrl: string;
}

export default function ImageTile(props: IImageTileProps) {
  const classes = useStyles();

  if (props.imageUrl === '') {
    return <div className={classes.root} />
  }

  return (
    <div className={classes.root}>
      <div className={classes.imgContainer}>
        <img className={classes.img} src={props.imageUrl} alt='batch' />
        <Select></Select>
      </div>
    </div>
  );
}