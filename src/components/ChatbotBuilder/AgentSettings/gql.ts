import gql from 'graphql-tag';

export const updateBotSettingsMutation = gql`
  mutation($uname: String!, $settings: JSON!) {
    ChatbotService_updateBotSettings(uname: $uname, settings: $settings)
  }
`;

export const getBotSettingsQuery = gql`
  query($uname: String!) {
    ChatbotService_botSettings(uname: $uname)
  }
`;
