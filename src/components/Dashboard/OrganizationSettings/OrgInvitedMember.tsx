
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import { useQuery } from 'react-apollo';
import { useParams } from 'react-router';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import {IInvitedMember} from '../../../models/user-service';
import gql from 'graphql-tag';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

interface IInvitedMemberProps {
    OrgMemberInvite: IInvitedMember[] | undefined;
}

function InvitedMemberTable() {
  const classes = useStyles();
  const { orgId } = useParams();
  const invitedMemberData = useQuery<IInvitedMemberProps>(GET_INVITED_ORG_MEMBERS, { variables: { orgId } });
  const invitedMember: IInvitedMember[] | undefined = invitedMemberData && invitedMemberData.data && invitedMemberData.data.OrgMemberInvite;

  if (invitedMemberData.loading) {
    return <ContentLoading />;
  }

  if (invitedMemberData.error) {
    return <ApolloErrorPage error={invitedMemberData.error}/>;
  }
  
  return (
    <Paper className={classes.paper}>
      <Toolbar>
        <Typography variant="h5">{`Invited Organization Members`}</Typography>
      </Toolbar>
      {invitedMember ? (
        <TableContainer component={Paper} aria-label="Projects">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Org Name</TableCell>
                <TableCell>Sender Name</TableCell>
                <TableCell>Sender Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={''}>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
     ) : (
          <Typography align="center" variant="h6">
            {'No invited members found'}
          </Typography>
    )} 
    </Paper>
  );
}

const GET_INVITED_ORG_MEMBERS = gql`
    query($orgId: String!){
        orgMemberInvites(orgId: $orgId){
            id
            email
            orgId
            orgName
            senderName
            senderEmail
            timestamp
            role
        }
    }
`;
export default InvitedMemberTable;

