import React, { useState } from 'react';
import styled from 'styled-components';
import IconButtonBavard from './IconButtons/IconButtonBavard';
import NavItem from './IconButtons/NavItem';
import { IUser } from '../models/user-service';

const VerticalSidebar = styled.div`
  position: fixed;
  height: 100%;
  width: 73px;
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

	const createPath = (pageName: string): string => {
    if (!user.activeProject) {
      return '/no-project';
    }
    return `/orgs/${user.activeProject.orgId}/projects/${user.activeProject.id}/${pageName}`;
  };

  const openDashboard = (key: number) => {
    setSelected(key);
    onClick(1);
  };
  const openBotCreation = (key: number) => {
    setSelected(key);
    onClick(2);
  };
  const openPage = (key: number) => {
		setSelected(key);
		onClose()
  };

  const items = [
    {
      path:
        '/' /* path is used as id to check which NavItem is active basically */,
      name: 'Dashboard',
      css: 'Dashboard',
      key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */,
      handler: openDashboard,
    },
    {
      path: '/about',
      name: 'Create Bot',
      css: 'BotBuilder',
      key: 2,
      handler: openBotCreation,
    },
    {
      path: createPath('image-labeling/collections'),
      name: 'ImageLabeling',
      css: 'ImageLabeling',
      key: 3,
      handler: openPage,
    },
    {
      path: createPath('qa'),
      name: 'FAQ',
      css: 'FAQ',
      key: 4,
      handler: openPage,
    },
    {
      path: createPath('text-labeling'),
      name: 'TextLabeling',
      css: 'TextLabeling',
      key: 5,
      handler: openPage,
    },
  ];

  const [selected, setSelected] = useState(0);  

  return (
    <VerticalSidebar>
      <IconButtonBavard
        onClick={() => console.log('bavard_icon')}
        tooltip="tooltip"
      />
      {items.map((item) => (
        <NavItem
          active={selected === item.key}
          key={item.key}
          keyVal={item.key}
          path={item.path}
          css={item.css}
          onClick={item.handler}
        />
      ))}
    </VerticalSidebar>
  );
};

export default Sidebar;
