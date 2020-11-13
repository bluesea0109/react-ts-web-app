import gql from 'graphql-tag';

export const createSlotMutation = gql`
  mutation($agentId: Int!, $slots: [ChatbotService_SlotInput!]!) {
    ChatbotService_createSlots(agentId: $agentId, slots: $slots) {
      id
      agentId
      name
      type
    }
  }
`;

export const getSlotsQuery = gql`
  query($agentId: Int!) {
    ChatbotService_getSlots(agentId: $agentId) {
      id
      agentId
      name
      type
    }
  }
`;

export const updateSlotMutation = gql`
  mutation($id: Int!, $name: String!, $type: String!) {
    ChatbotService_updateSlot(id: $id, name: $name, type: $type) {
      id
      agentId
      name
      type
    }
  }
`;

export const deleteSlotMutation = gql`
  mutation($id: Int!) {
    ChatbotService_deleteSlot(id: $id) {
      id
    }
  }
`;
