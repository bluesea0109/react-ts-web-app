import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CommonTable, Button } from '@bavard/react-components';
import { CardHeader } from '@material-ui/core';

import { IInvitedMember } from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import { GET_INVITED_WORKSPACE_MEMBERS, REVOKE_INVITATION } from './gql';

interface IInvitedMemberProps {
  workspaceMemberInvites: IInvitedMember[] | undefined;
}

interface IInvitedMemberTableProps {
  workspaceId?: String;
}

const InvitedMemberTable: React.FC<IInvitedMemberTableProps> = ({
  workspaceId,
}) => {
  const [item, setInvite] = useState<{
    workspaceId: string;
    id: string;
  }>();
  const invitedMemberData = useQuery<IInvitedMemberProps>(
    GET_INVITED_WORKSPACE_MEMBERS,
    { variables: { workspaceId } },
  );
  const invitedMembers: IInvitedMember[] | undefined =
    invitedMemberData &&
    invitedMemberData.data &&
    invitedMemberData.data.workspaceMemberInvites;

  const [doRevokeInvitation, revokeInvitationResp] = useMutation(
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
      components={{
        Toolbar: () => <CardHeader />,
      }}
    />
  );
};

export default InvitedMemberTable;
