import { useQuery } from '@apollo/client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { GET_ORGS } from '../../gql-queries';
import ContentLoading from '../ContentLoading';
import { IReceivedData } from './types';
import { IOrg } from '../../models';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    title: {
      fontSize: 20,
    },
  })
);

function Orgs() {
  const classes = useStyles();
  const { loading, data } = useQuery<IReceivedData>(GET_ORGS);
  const orgs = useMemo(() => data?.orgs, [data]);

  return loading ? (
    <ContentLoading />
  ) : (
    <>
      <Typography variant="h4">{'Organizations'}</Typography>
      {orgs ? (
        <TableContainer component={Paper} aria-label="Orgs">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Org id</TableCell>
                <TableCell align="left">Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orgs.map((org) => (
                <TableRow key={org.id}>
                  <TableCell component="th" scope="row">
                    {org.id}
                  </TableCell>
                  <TableCell align="left">{org.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography align="center" variant="h6">
          {'No organizations found'}
        </Typography>
      )}
    </>
  );
}

export default Orgs;
