
import { useQuery } from '@apollo/client';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import React from 'react';
import { useParams } from 'react-router';
import {IInvitedMember} from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

const useStyles = makeStyles((theme: Theme) =>
createStyles({
    root: {
      margin: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2),
    },
    tableContainer: {
        maxHeight: '75vh',
    },
    tableHeader: {
        '& th' : {
        backgroundColor: '#f5f5f5',
        },
    },
  }),
);

interface IInvitedMemberProps {
    orgMemberInvites: IInvitedMember[] | undefined;
}

function InvitedMemberTable() {
  const classes = useStyles();
  const { orgId } = useParams();
  const invitedMemberData = useQuery<IInvitedMemberProps>(GET_INVITED_ORG_MEMBERS, { variables: { orgId } });
  const invitedMember: IInvitedMember[] | undefined = invitedMemberData
                        && invitedMemberData.data && invitedMemberData.data.orgMemberInvites;

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
      {invitedMember && invitedMember.length > 0 ? (
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader={true} aria-label="sticky table">
            <TableHead>
              <TableRow className={classes.tableHeader}>
                <TableCell>Email</TableCell>
                <TableCell>Org Name</TableCell>
                <TableCell>Sender Name</TableCell>
                <TableCell>Sender Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {
                    invitedMember.map((item) => {
                        return (
                            <TableRow key={item.id}>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.orgName}</TableCell>
                                <TableCell>{item.senderName}</TableCell>
                                <TableCell>{item.senderEmail}</TableCell>
                                <TableCell>{item.role}</TableCell>
                            </TableRow>
                        );
                    })
                }
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
          <Typography align="center" variant="h6">
            {'There is No invited members'}
           </Typography>
     )}
    </Paper>
  );
}

const GET_INVITED_ORG_MEMBERS = gql`
    query($orgId: String!) {
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
