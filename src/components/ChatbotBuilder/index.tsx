import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IUser } from '../../models/user-service';
import Agent from './Agent/Agent';
import AgentDetails from './Agent/AgentDetails';
import SlotsTable from './Slot/SlotsTable';

interface IChatbotBuilderProps {
  user: IUser;
}
const AgentWarpper: React.FC<IChatbotBuilderProps> = ({ user }) => {
  return (
    <Switch>
      <Route exact={true} path="/orgs/:orgId/projects/:projectId/chatbot-builder">
        <Agent user={user} />
      </Route>
      <Route
        exact={true} path="/orgs/:orgId/projects/:projectId/chatbot-builder/agents/:agentId/:agentTab"
        component={AgentDetails}
      />
      <Route
        exact={true}
        path="/orgs/:orgId/projects/:projectId/chatbot-builder/slots"
        component={SlotsTable}
      />
    </Switch>
  );
};

export default AgentWarpper;
