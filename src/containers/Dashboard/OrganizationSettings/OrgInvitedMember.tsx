import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@material-ui/core';

import React, { useState } from 'react';
import { useParams } from 'react-router';
import { IInvitedMember } from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import { GET_INVITED_ORG_MEMBERS, REVOKE_INVITATION } from './gql';
import { CommonTable } from '../../../components';

interface IInvitedMemberProps {
  orgMemberInvites: IInvitedMember[] | undefined;
}

function InvitedMemberTable() {
  const { orgId } = useParams<{ orgId: string }>();
  const [item, setInvite] = useState<{
    orgId: string;
    id: string;
  }>();
  const invitedMemberData = useQuery<IInvitedMemberProps>(
    GET_INVITED_ORG_MEMBERS,
    { variables: { orgId } },
  );
  const invitedMembers: IInvitedMember[] | undefined =
    invitedMemberData &&
    invitedMemberData.data &&
    invitedMemberData.data.orgMemberInvites;

  const [doRevokeInvitation, revokeInvitationResp] = useMutation(
    REVOKE_INVITATION,
    {
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
    },
  );
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
    return <ContentLoading shrinked={true} />;
  }

  if (invitedMemberData.error) {
    return <ApolloErrorPage error={invitedMemberData.error} />;
  }
  if (revokeInvitationResp.error) {
    return <ApolloErrorPage error={revokeInvitationResp.error} />;
  }

  const columns = [
    { title: 'Email', field: 'email' },
    { title: 'Org Name', field: 'orgName' },
    { title: 'Sender Name', field: 'senderName' },
    { title: 'Sender Email', field: 'senderEmail' },
    { title: 'Role', field: 'role' },
    {
      title: 'Revoke Invitation',
      renderRow: (rowData: IInvitedMember) => (
        <Button variant="contained" onClick={() => revokeInvitation(rowData)}>
          Revoke
        </Button>
      ),
    },
  ];

  return (
    <CommonTable
      data={{
        columns,
        rowsData: invitedMembers,
      }}
    />
  );
}

export default InvitedMemberTable;
