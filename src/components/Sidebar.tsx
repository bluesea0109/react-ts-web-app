import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { IUser } from '../models/user-service';
import IconButtonBavard from './IconButtons/IconButtonBavard';
import NavItem from './IconButtons/NavItem';

const VerticalSidebar = styled.div`
  position: fixed;  
  height: 100%;
  width: 75px;
  z-index: 100000;
  background-color: #040521;
  overflow-x: hidden;
  padding-top: 20px;
  color: white;
`;

interface ISidebarProps {
  user: IUser;
  onClick: (key: number) => void;
  onClose: () => void;
  onSetAgentID: (id: object) => void;
}

const Sidebar = (props: ISidebarProps) => {
  const { onClick, onClose, user, onSetAgentID } = props;
  // const [open, setOpen] = useState(false);
  const [openSubItem, setOpenSubItem] = useState(false);
  const [selected, setSelected] = useState(0);
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

  useEffect(() => {
    if (selected === 2 && match?.path) {
      // setOpen(true);
      setOpenSubItem(true);
      onClick(6);
      onSetAgentID(agentParams);
    } 
  }, [match?.path]);// eslint-disable-line react-hooks/exhaustive-deps

  const openDashboard = (key: number) => {
    setSelected(key);
    setOpenSubItem(false);
    onClick(1);
  };
  const openBotCreation = (key: number) => {
    setSelected(key);
    setOpenSubItem(false);
    onClose();
  };
  const openPage = (key: number) => {
    setSelected(key);
    setOpenSubItem(false);
    onClose();
  };

  const openConfig = (key: number) => {
    setSelected(key);
    setOpenSubItem(true);
    onClick(6);
  };

  const openLaunching = (key: number) => {
    setSelected(key);
    setOpenSubItem(true);
    onClick(8);
  };

  const openTraining = (key: number) => {
    setSelected(key);
    setOpenSubItem(true);
    onClick(7);
  };

  const data = [
    {
      path:
        '/' /* path is used as id to check which NavItem is active basically */,
      name: 'Dashboard',
      css: 'Dashboard',
      key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */,
      handler: openDashboard,
      hidden: false,
    },
    {
      path: createPath('chatbot-builder'),
      name: 'Create Bot',
      css: 'BotBuilder',
      key: 2,
      handler: openBotCreation,
      hidden: false,
    },
    {
      path: createPath(''),
      name: 'openConfig',
      css: 'Configuration',
      key: 6,
      handler: openConfig,
      hidden: true,
    },
    {
      path: createPath(''),
      name: 'openTraining',
      css: 'Training',
      key: 7,
      handler: openTraining,
      hidden: true,
    },
    {
      path: createPath(''),
      name: 'openLaunching',
      css: 'Launching',
      key: 8,
      handler: openLaunching,
      hidden: true,
    },
    {
      path: createPath('image-labeling/collections'),
      name: 'ImageLabeling',
      css: 'ImageLabeling',
      key: 3,
      handler: openPage,
      hidden: false,
    },
    {
      path: createPath('qa'),
      name: 'FAQ',
      css: 'FAQ',
      key: 4,
      handler: openPage,
      hidden: false,
    },
    {
      path: createPath('text-labeling'),
      name: 'TextLabeling',
      css: 'TextLabeling',
      key: 5,
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
          active={selected === item.key}
          key={item.key}
          keyVal={item.key}
          path={item.path}
          css={item.css}
          hidden={!item.hidden}
          onClick={item.handler}
        />
      ))}
    </VerticalSidebar>
  );
};

export default Sidebar;
