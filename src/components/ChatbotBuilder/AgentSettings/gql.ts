import gql from 'graphql-tag';

export const updateBotSettingsMutation = gql`
  mutation($uname: String!, $settings: JSON!) {
    ChatbotService_updateWidgetSettings(uname: $uname, settings: $settings)
  }
`;

export const getBotSettingsQuery = gql`
  query($uname: String!, $dev: Boolean) {
    ChatbotService_widgetSettings(uname: $uname, dev: $dev)
  }
`;

export const botIconUploadQuery = gql`
  query($agentId: Int!, $iconType: ChatbotService_BotIconType!) {
    ChatbotService_botIconUploadUrl(agentId: $agentId, iconType: $iconType) {
      url
    }
  }
`;
