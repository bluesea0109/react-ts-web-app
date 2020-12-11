import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CommonTable, Button } from '@bavard/react-components';

import { IInvitedMember } from '../../../models/user-service';
import { GET_INVITED_WORKSPACE_MEMBERS, REVOKE_INVITATION } from './gql';

interface IInvitedMemberTableProps {
  workspaceId?: String;
  invitedMembers?: IInvitedMember[];
}

const InvitedMemberTable: React.FC<IInvitedMemberTableProps> = ({
  workspaceId,
  invitedMembers,
}) => {
  const [item, setInvite] = useState<{
    workspaceId: string;
    id: string;
  }>();

  const [doRevokeInvitation, revokeInvitationResult] = useMutation(
    REVOKE_INVITATION,
    {
      variables: {
        workspaceId: item?.workspaceId,
        inviteId: item?.id,
      },
      refetchQueries: [
        {
          query: GET_INVITED_WORKSPACE_MEMBERS,
          variables: { workspaceId },
        },
      ],
    },
  );
  const revokeInvitation = (invite: IInvitedMember) => {
    setInvite(item);
    doRevokeInvitation({
      variables: {
        workspaceId: invite.workspaceId,
        inviteId: invite.id,
      },
    });
  };

  const columns = [
    { title: 'Email', field: 'email' },
    { title: 'Workspace Name', field: 'workspaceName' },
    { title: 'Sender Name', field: 'senderName' },
    { title: 'Sender Email', field: 'senderEmail' },
    { title: 'Role', field: 'role' },
    {
      title: 'Revoke Invitation',
      renderRow: (rowData: IInvitedMember) => (
        <Button
          title="Revoke"
          variant="contained"
          onClick={() => revokeInvitation(rowData)}
        />
      ),
    },
  ];

  return (
    <CommonTable
      data={{
        columns,
        rowsData: invitedMembers,
      }}
      pagination={{
        colSpan: 6,
        rowsPerPage: 5,
      }}
    />
  );
};

export default InvitedMemberTable;
