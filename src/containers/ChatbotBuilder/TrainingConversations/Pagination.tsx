import { createStyles, makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React from 'react';

interface IPagination {
  total: number;

  onChange: (value: number) => void;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }),
);

export default function BavardPagination(props: IPagination) {
  const classes = useStyles();
  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    props.onChange(value);
  };

  return (
    <div className={classes.root}>
      <Pagination count={props.total} page={page} onChange={handleChange} />
    </div>
  );
}
