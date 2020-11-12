import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { IUser } from '../models/user-service';
import { MenuName } from '../utils/enums';
import IconButtonBavard from './IconButtons/IconButtonBavard';
import NavItem from './IconButtons/NavItem';

const VerticalSidebar = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100%;
  width: 80px;
  z-index: 1300;
  background-color: #040521;
  overflow-x: hidden;
  padding-top: 20px;
  color: white;
`;

interface ISidebarProps {
  user: IUser;
  onClick: (key: MenuName) => void;
  onClose: () => void;
  onSetAgentID: (id: object) => void;
}

const Sidebar = ({ onClick, onClose, user, onSetAgentID }: ISidebarProps) => {
  // const [open, setOpen] = useState(false);
  const [openSubItem, setOpenSubItem] = useState(false);
  const [selected, setSelected] = useState(MenuName.DASHBOARD);

  const history = useHistory();
  const currentLocation = history.location.pathname;
  const createPath = (pageName: string): string => {
    if (!user.activeProject) {
      return '/no-project';
    }
    return `/orgs/${user.activeProject.orgId}/projects/${user.activeProject.id}/${pageName}`;
  };

  const match = useRouteMatch({
    path: '/orgs/:orgId/projects/:projectId/chatbot-builder/agents/:agentId',
    strict: false,
    sensitive: true,
  });
  const agentParams: any = match?.params;

  const createAgentPath = (agentTab: string): string => {
    if (!user.activeProject) {
      return '/no-project';
    }
    return `/orgs/${user.activeProject.orgId}/projects/${user.activeProject.id}/chatbot-builder/agents/${agentParams?.agentId}/${agentTab}`;
  };

  useEffect(() => {
    if (selected === MenuName.CREATE_BOT && match?.path) {
      // setOpen(true);
      setOpenSubItem(true);
      onClick(MenuName.OPEN_CONFIG);            // open config in default
      setSelected(MenuName.OPEN_CONFIG);        // ...
      onSetAgentID(agentParams);                // who?
    }
  }, [match?.path]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const homeRegx = RegExp('^/$', 'g');
    const createBotRegx = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder$',
      'g',
    );
    const createBot_Actions = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/Actions$',
      'g',
    );
    const createBot_Intents = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/Intents$',
      'g',
    );
    const createBot_Tags = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/Tags$',
      'g',
    );
    const createBot_Slots = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/Slots$',
      'g',
    );
    const createBot_Graph = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/graph-policy$',
      'g',
    );
    const createBot_training = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/training$',
      'g',
    );
    const createBot_examples = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/nluExamples$',
      'g',
    );
    const createBot_Launch = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/chats$',
    );
    const createBot_Upload = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/upload-data$',
    );
    const createBot_Live_Conversations = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/live-conversations$',
    );
    const createBot_Training_Conversations = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/training-conversations$',
    );
    const createBot_Training_Exports = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/exports$',
    );
    const createBot_Training_Settings = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/settings$',
    );
    const createBot_Training_Agents = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/chatbot-builder/agents/[0-9]+/settings$',
    );
    const imageRegx = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/image-labeling/collections$',
      'g',
    );
    const faqRegx = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/qa$',
      'g',
    );
    const txtRegx = RegExp(
      '^/orgs/[A-Z,a-z,0-9-]+/projects/[A-Z,a-z,0-9-]+/text-labeling$',
      'g',
    );
    if (homeRegx.test(currentLocation)) {
      onClick(MenuName.DASHBOARD);
      setSelected(MenuName.DASHBOARD);
    } else if (createBotRegx.test(currentLocation)) {
      // onClick(MenuName.CREATE_BOT);
      // setSelected(MenuName.CREATE_BOT);
      onClose();
    } else if (imageRegx.test(currentLocation)) {
      onClose();
    } else if (faqRegx.test(currentLocation)) {
      onClose();
    } else if (txtRegx.test(currentLocation)) {
      onClose();
    } else if (
      createBot_Actions.test(currentLocation) ||
      createBot_Intents.test(currentLocation) ||
      createBot_Tags.test(currentLocation) ||
      createBot_Slots.test(currentLocation) ||
      createBot_Graph.test(currentLocation)
    ) {
      setOpenSubItem(true);
      onClick(MenuName.OPEN_CONFIG);
      setSelected(MenuName.OPEN_CONFIG);
    } else if (
      createBot_training.test(currentLocation) ||
      createBot_examples.test(currentLocation) ||
      createBot_Training_Conversations.test(currentLocation)
    ) {
      console.log('******************************** Opening');
      setOpenSubItem(true);
      onClick(MenuName.OPEN_TRAINING);
      setSelected(MenuName.OPEN_TRAINING);
    } else if (
      createBot_Launch.test(currentLocation) ||
      createBot_Upload.test(currentLocation) ||
      createBot_Live_Conversations.test(currentLocation) ||
      createBot_Training_Exports.test(currentLocation) ||
      createBot_Training_Settings.test(currentLocation) ||
      createBot_Training_Agents.test(currentLocation)
    ) {
      setOpenSubItem(true);
      onClick(MenuName.OPEN_LAUNCHING);
      setSelected(MenuName.OPEN_LAUNCHING);
    }
  }, [currentLocation]); // eslint-disable-line react-hooks/exhaustive-deps

  const openDashboard = (key: MenuName) => {
    setSelected(key);
    setOpenSubItem(false);
    onClick(MenuName.DASHBOARD);
  };
  const openBotCreation = (key: MenuName) => {
    setSelected(key);
    setOpenSubItem(false);
    onClick(MenuName.CREATE_BOT);
  };
  const openPage = (key: MenuName) => {
    setSelected(key);
    setOpenSubItem(false);
    onClose();
  };

  const openConfig = (key: MenuName) => {
    setSelected(key);
    setOpenSubItem(true);
    onClick(MenuName.OPEN_CONFIG);
  };

  const openLaunching = (key: MenuName) => {
    setSelected(key);
    setOpenSubItem(true);
    onClick(MenuName.OPEN_LAUNCHING);
  };

  const openTraining = (key: MenuName) => {
    setSelected(key);
    setOpenSubItem(true);
    onClick(MenuName.OPEN_TRAINING);
  };

  const data = [
    {
      path:
        '/' /* path is used as id to check which NavItem is active basically */,
      name: MenuName.DASHBOARD,
      css: 'Dashboard',
      handler: openDashboard,
      hidden: false,
    },
    {
      path: createPath('chatbot-builder'),
      name: MenuName.CREATE_BOT,
      css: 'BotBuilder',
      handler: openBotCreation,
      hidden: false,
    },
    // {
    //   path: createAgentPath('Actions'),
    //   name: MenuName.OPEN_CONFIG,
    //   css: 'Configuration',
    //   handler: openConfig,
    //   hidden: true,
    // },
    // {
    //   path: createAgentPath('training-jobs'),
    //   name: MenuName.OPEN_TRAINING,
    //   css: 'Training',
    //   handler: openTraining,
    //   hidden: true,
    // },
    // {
    //   path: createAgentPath('chats'),
    //   name: MenuName.OPEN_LAUNCHING,
    //   css: 'Launching',
    //   handler: openLaunching,
    //   hidden: true,
    // },
    {
      path: createPath('image-labeling/collections'),
      name: MenuName.IMAGE_LABELING,
      css: 'ImageLabeling',
      handler: openPage,
      hidden: false,
    },
    {
      path: createPath('qa'),
      name: MenuName.FAQ,
      css: 'FAQ',
      handler: openPage,
      hidden: false,
    },
    {
      path: createPath('text-labeling'),
      name: MenuName.TEXT_LABELING,
      css: 'TextLabeling',
      handler: openPage,
      hidden: false,
    },
  ];

  // if (openSubItem) {
  //   data[2].hidden = false;
  //   data[3].hidden = false;
  //   data[4].hidden = false;
  // } else {
  //   data[2].hidden = true;
  //   data[3].hidden = true;
  //   data[4].hidden = true;
  // }

  return (
    <VerticalSidebar>
      <IconButtonBavard onClick={() => {}} tooltip="tooltip" />
      {data.map((item) => (
        <NavItem
          active={selected === item.name}
          key={item.name}
          name={item.name}
          path={item.path}
          hidden={!item.hidden}
          onClick={item.handler}
        />
      ))}
    </VerticalSidebar>
  );
};

export default Sidebar;
