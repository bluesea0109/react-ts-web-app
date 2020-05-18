import { useQuery } from '@apollo/react-hooks';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React, { useMemo } from 'react';
import { GET_ORGS } from '../../gql-queries';
import ContentLoading from '../ContentLoading';
import { IReceivedData } from './types';

function Orgs() {
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
