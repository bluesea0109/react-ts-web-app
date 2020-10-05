import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import IconButtonBavard from './IconButtons/IconButtonBavard';
import NavItem from './IconButtons/NavItem';
import { IUser } from '../models/user-service';

const VerticalSidebar = styled.div`
  position: fixed;
  height: 100%;
  width: 64px;
  z-index: 100000;
  background-color: #040521;
  overflow-x: hidden;
  padding-top: 20px;
  color: white;
`;
const NavIcon = styled.div`
  margin-top: 10px;
  width: 50px;
  height: 50px;
  background-color: white;
`;

interface ISidebarProps {
	user: IUser;
	onClick: (key: number) => void;
	onClose: () => void;
}

const Sidebar = (props: ISidebarProps) => {
  const { onClick, onClose } = props;

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
      path: '/NoMatch',
      name: 'ImageLabeling',
      css: 'ImageLabeling',
      key: 3,
      handler: openPage,
    },
    {
      path: '/NoMatch',
      name: 'FAQ',
      css: 'FAQ',
      key: 4,
      handler: openPage,
    },
    {
      path: '/NoMatch',
      name: 'TextLabeling',
      css: 'TextLabeling',
      key: 5,
      handler: openPage,
    },
  ];

  const [selected, setSelected] = useState(0);
  console.log('selected >>> ', selected);

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
