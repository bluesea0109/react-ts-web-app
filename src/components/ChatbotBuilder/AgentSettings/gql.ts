import gql from 'graphql-tag';

export const updateBotSettingsMutation = gql`
  mutation($uname: String!, $settings: JSON!) {
    ChatbotService_updateBotSettings(uname: $uname, settings: $settings)
  }
`;

export const getBotSettingsQuery = gql`
  query($uname: String!, $dev: Boolean) {
    ChatbotService_botSettings(uname: $uname, dev: $dev)
  }
`;

export const botIconUploadQuery = gql`
  query($agentId: Int!, $basename: String!) {
    ChatbotService_botIconUploadUrl(agentId: $agentId, basename: $basename) {
        url
    }
  }
`;
