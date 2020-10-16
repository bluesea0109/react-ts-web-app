import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { IUser } from '../models/user-service';
import { MenuName } from '../utils/enums';
import IconButtonBavard from './IconButtons/IconButtonBavard';
import NavItem from './IconButtons/NavItem';

const VerticalSidebar = styled.div`
  position: fixed;
  height: 100%;
  width: 75px;
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
      onClick(MenuName.OPEN_CONFIG);
      setSelected(MenuName.OPEN_CONFIG);
      onSetAgentID(agentParams);
    }
  }, [match?.path]); // eslint-disable-line react-hooks/exhaustive-deps

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
    {
      path: createAgentPath('Actions'),
      name: MenuName.OPEN_CONFIG,
      css: 'Configuration',
      handler: openConfig,
      hidden: true,
    },
    {
      path: createAgentPath('training-jobs'),
      name: MenuName.OPEN_TRAINING,
      css: 'Training',
      handler: openTraining,
      hidden: true,
    },
    {
      path: createAgentPath('chats'),
      name: MenuName.OPEN_LAUNCHING,
      css: 'Launching',
      handler: openLaunching,
      hidden: true,
    },
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

  if (openSubItem) {
    data[2].hidden = false;
    data[3].hidden = false;
    data[4].hidden = false;
  } else {
    data[2].hidden = true;
    data[3].hidden = true;
    data[4].hidden = true;
  }

  return (
    <VerticalSidebar>
      <IconButtonBavard
        onClick={() => console.log('bavard_icon')}
        tooltip="tooltip"
      />
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
