
import { useMutation, useQuery} from '@apollo/client';
import { string } from '@bavard/agent-config/dist/graph-policy/yup';
import {
    Button,
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
import React, { useState } from 'react';
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
  const { orgId } = useParams<{ orgId: string }>();
  const [ item, setInvite ] = useState<{
    orgId: string,
    id: string,
  }>();
  const invitedMemberData = useQuery<IInvitedMemberProps>(GET_INVITED_ORG_MEMBERS, { variables: { orgId } });
  const invitedMember: IInvitedMember[] | undefined = invitedMemberData
                        && invitedMemberData.data && invitedMemberData.data.orgMemberInvites;

  const [doRevokeInvitation, revokeInvitationResp] = useMutation(REVOKE_INVITATION, {
    variables: {
      orgId: item?.orgId,
      inviteId: item?.id,
    },
    refetchQueries: [
      {
        query: GET_INVITED_ORG_MEMBERS,
        variables: { orgId },
      },
    ],
  });
  const revokeInvitation = (invite: IInvitedMember) => {
    setInvite(item);
    doRevokeInvitation({
      variables: {
        orgId: invite.orgId,
        inviteId: invite.id,
      },
    });
  };

  if (invitedMemberData.loading || revokeInvitationResp.loading) {
    return <ContentLoading />;
  }

  if (invitedMemberData.error) {
    return <ApolloErrorPage error={invitedMemberData.error}/>;
  }
  if (revokeInvitationResp.error) {
    return <ApolloErrorPage error={revokeInvitationResp.error} />;
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
                <TableCell>Revoke Invitation</TableCell>
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
                                <TableCell>
                                  <Button variant="contained" onClick={() => revokeInvitation(item)}>Revoke</Button>
                                </TableCell>
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

export const GET_INVITED_ORG_MEMBERS = gql`
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

export const REVOKE_INVITATION = gql`
  mutation($orgId: String!, $inviteId: String!) {
    deleteOrgMemberInvite(
      orgId: $orgId
      inviteId: $inviteId
    )
  }
`;

export default InvitedMemberTable;
