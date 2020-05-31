import React from 'react';
import { Route, Switch} from 'react-router-dom';
import { IUser } from '../../models';
import Agent from './Agent/Agent';
import AgentDetails from './Agent/AgentDetails';

interface IChatbotBuilderProps {
  user: IUser;
}
const AgentWarpper: React.FC<IChatbotBuilderProps> = ({ user}) => {
    return (
         <Switch>
            <Route exact={true} path="/orgs/:orgId/projects/:projectId/chatbot-builder">
              <Agent user={user} />
            </Route>
            <Route exact={true} path="/orgs/:orgId/projects/:projectId/chatbot-builder/agents/:agentId" component={AgentDetails} />
          </Switch>
    );
  };

  export default AgentWarpper;
