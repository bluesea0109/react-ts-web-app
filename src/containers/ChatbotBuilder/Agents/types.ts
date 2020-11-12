import { IAgent } from '../../../models/chatbot-service';
export interface IGetAgents {
  ChatbotService_agents: IAgent[] | undefined;
}
