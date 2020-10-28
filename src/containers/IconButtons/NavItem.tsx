import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { Animated } from 'react-animated-css';
import BotBuilder from './icons/BotBuilder';
import Configuration from './icons/Configuration';
import Dashboard from './icons/Dashboard';
import FAQ from './icons/FAQ';
import ImageLabeling from './icons/ImageLabeling';
import Launching from './icons/Launching';
import TextLabeling from './icons/TextLabeling';
import Training from './icons/Training';

import { MenuName } from '../../utils/enums';

const StyledNavItem = styled.div`
  display: flex;
  align-items: center;
  height: 75px;
  width: 80px; /* width must be same size as NavBar to center */
  text-align: center; /* Aligns <a> inside of NavIcon div */
  margin: 0px; /* Puts space between NavItems */
  margin-right: 25px;
  text-decoration: none;
  font-size: 2.7em;
`;

interface NavItemProps {
  active: boolean;
  path: string;
  name: MenuName;
  hidden: boolean;
  onClick: (key: MenuName) => void;
}

const NavItem = ({ active, path, onClick, name, hidden}: NavItemProps) => {
  const handleClick = () => {
    onClick(name);
  };

  const Icon = useMemo(() => {
    switch (name) {
      case MenuName.DASHBOARD:
        return <Dashboard active={active} />;
      case MenuName.FAQ:
        return <FAQ active={active} />;
      case MenuName.IMAGE_LABELING:
        return <ImageLabeling active={active} />;
      case MenuName.TEXT_LABELING:
        return <TextLabeling active={active} />;
      case MenuName.CREATE_BOT:
        return <BotBuilder active={active} />;
      case MenuName.OPEN_CONFIG:
        return <Configuration active={active} />;
      case MenuName.OPEN_TRAINING:
        return <Training active={active} />;
      case MenuName.OPEN_LAUNCHING:
        return <Launching active={active} />;
      default:
        return null;
    }
  }, [name, active]);

  const isOpenMenu = [MenuName.OPEN_CONFIG, MenuName.OPEN_TRAINING, MenuName.OPEN_LAUNCHING].find(menuName => name === menuName);

  return (
    <div>
      <NavLink
        to={path}
        onClick={handleClick}
        style={{color: 'white', textDecoration: 'none'}}
      >
        <Animated
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={hidden}
          style={!hidden ? { display: 'none' } : {}}>
          <StyledNavItem
            className={active ? 'active' : ''}
            style={isOpenMenu ? { backgroundColor: '#cccccc33' } : {}}
          >
            {Icon}
          </StyledNavItem>
        </Animated>
      </NavLink>
    </div>
  );
};

export default NavItem;
