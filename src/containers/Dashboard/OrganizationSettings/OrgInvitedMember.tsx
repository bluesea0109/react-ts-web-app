
import { useMutation, useQuery} from '@apollo/client';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@material-ui/core';

import React, { useState } from 'react';
import { useParams } from 'react-router';
import {IInvitedMember} from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import {
  GET_INVITED_ORG_MEMBERS,
  REVOKE_INVITATION,
} from './gql';

interface IInvitedMemberProps {
    orgMemberInvites: IInvitedMember[] | undefined;
}

function InvitedMemberTable() {

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
    return <ContentLoading shrinked={true}/>;
  }

  if (invitedMemberData.error) {
    return <ApolloErrorPage error={invitedMemberData.error}/>;
  }
  if (revokeInvitationResp.error) {
    return <ApolloErrorPage error={revokeInvitationResp.error} />;
  }

  return (
    <Table stickyHeader={true}>
      <TableHead>
        <TableRow>
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
            (invitedMember || []).map((item) => {
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
  );
}

export default InvitedMemberTable;
