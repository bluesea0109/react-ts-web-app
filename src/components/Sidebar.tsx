import React, { useState } from 'react';
import styled from 'styled-components';
import { IUser } from '../models/user-service';
import IconButtonBavard from './IconButtons/IconButtonBavard';
import NavItem from './IconButtons/NavItem';
import {matchPath} from 'react-router'
import { useHistory, useParams } from 'react-router';

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
}

const Sidebar = (props: ISidebarProps) => {
  const { onClick, onClose, user } = props;
  const { orgId, projectId, agentId, agentTab } = useParams<{
    orgId: string;
    projectId: string;
    agentId: string;
    agentTab: string;
  }>();

  const [open, setOpen] = useState(false);

  const createPath = (pageName: string): string => {
    if (!user.activeProject) {
      return '/no-project';
    }
    return `/orgs/${user.activeProject.orgId}/projects/${user.activeProject.id}/${pageName}`;
  };

  console.log(orgId, projectId, agentId, agentTab)
  const path = window.location.href
  const match = matchPath(path.replace(/(^\w+:|^)\/\//, ''), {
    path: "/orgs/:orgId/projects/:projectId/chatbot-builder/agents/:agentId/:agentTab/Actions "
  })

  console.log('match status ', match)

  const openDashboard = (key: number) => {
    setSelected(key);
    onClick(1);
  };
  const openBotCreation = (key: number) => {
    setSelected(key);
    onClose();
    // setOpen((open) => !open);
  };
  const openPage = (key: number) => {
    setSelected(key);
    onClose();
  };

  const openConfig = (key: number) => {
    setSelected(key);
    onClick(2);
  };

  const openLaunching = (key: number) => {
    setSelected(key);
    onClick(3);
  };

  const openTraining = (key: number) => {
    setSelected(key);
    onClick(4);
  };

  let data = [
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
      path: createPath('image-labeling/collections'),
      name: 'ImageLabeling',
      css: 'Configuration',
      key: 6,
      handler: openConfig,
      hidden: true,
    },
    {
      path: createPath('image-labeling/collections'),
      name: 'ImageLabeling',
      css: 'Training',
      key: 7,
      handler: openTraining,
      hidden: true,
    },
    {
      path: createPath('image-labeling/collections'),
      name: 'ImageLabeling',
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

  console.log('Open state ', open);
  let items;
  const [selected, setSelected] = useState(0);

  if (open) {
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
