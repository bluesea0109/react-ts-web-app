import gql from 'graphql-tag';

export const getSignedImgUploadUrlQuery = gql`
  query($agentId: Int!, $basename: String!) {
    ChatbotService_imageOptionUploadUrl(
      agentId: $agentId
      basename: $basename
    ) {
      url
    }
  }
`;

export const getOptionImagesQuery = gql`
  query($agentId: Int!) {
    ChatbotService_optionImages(agentId: $agentId) {
      url
      name
    }
  }
`;
