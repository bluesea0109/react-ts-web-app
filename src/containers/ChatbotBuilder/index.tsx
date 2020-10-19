import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IUser } from '../../models/user-service';
import AgentDetails from './Agents/AgentDetails';
import AllAgents from './Agents/AllAgents';

interface IChatbotBuilderProps {
  user: IUser;
}
const ChatbotBuilder: React.FC<IChatbotBuilderProps> = ({ user }) => {
  return (
    <Switch>
      <Route exact={true} path="/orgs/:orgId/projects/:projectId/chatbot-builder">
        <AllAgents user={user} />
      </Route>
      <Route
        exact={true} path="/orgs/:orgId/projects/:projectId/chatbot-builder/agents/:agentId/:agentTab"
        component={AgentDetails}
      />
    </Switch>
  );
};

export default ChatbotBuilder;
