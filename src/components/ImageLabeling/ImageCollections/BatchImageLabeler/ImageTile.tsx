import { Theme, makeStyles, createStyles } from '@material-ui/core';
import React from 'react';
import { ICategorySet } from '../../../../models';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    img: {
      maxHeight: 300,
      maxWidth: '100%',
      objectFit: 'scale-down',
      verticalAlign: 'bottom',
    },
    root: {
      flex: '1 1 0'
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
      <img className={classes.img} src={props.imageUrl} alt='batch' />
    </div>
  );
}