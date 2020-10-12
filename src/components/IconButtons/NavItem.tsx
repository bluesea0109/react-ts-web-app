import React from 'react';
import { Link, NavLink } from 'react-router-dom';
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
  height: 60px;
  width: 70px; /* width must be same size as NavBar to center */
  text-align: center; /* Aligns <a> inside of NavIcon div */
  margin: 0px; /* Puts space between NavItems */
  margin-right: 25px;
  a {
    font-size: 2.7em;
    color: ${(props: { active: boolean }) =>
      props.active ? 'white' : '#9FFFCB'};
    :hover {
      opacity: 0.7;
      text-decoration: none; /* Gets rid of underlining of icons */
    }
  }
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

  let Icon = null;

  switch (name) {
    case MenuName.DASHBOARD:
      Icon = <Dashboard active={active} />;
      break;
    case MenuName.FAQ:
      Icon = <FAQ active={active} />;
      break;
    case MenuName.IMAGE_LABELING:
      Icon = <ImageLabeling active={active} />;
      break;
    case MenuName.TEXT_LABELING:
      Icon = <TextLabeling active={active} />;
      break;
    case MenuName.CREATE_BOT:
      Icon = <BotBuilder active={active} />;
      break;
    case MenuName.OPEN_CONFIG:
      Icon = <Configuration active={active} />;
      break;
    case MenuName.OPEN_TRAINING:
      Icon = <Training active={active} />;
      break;
    case MenuName.OPEN_LAUNCHING:
      Icon = <Launching active={active} />;
      break;
    default:
      Icon = null;
      break;
  }

  const isOpenMenu = [MenuName.OPEN_CONFIG, MenuName.OPEN_TRAINING, MenuName.OPEN_LAUNCHING].find(menuName => name === menuName);

  return (
    <div>
      <NavLink to={path} activeStyle={{backgroundColor: 'red'}}>
        <Animated
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={hidden}
          style={!hidden ? { display: 'none' } : {}}>
          <StyledNavItem
            active={active}
            className={active ? 'active' : ''}
            style={isOpenMenu ? { backgroundColor: '#cccccc33' } : {}}>
            <Link to={path} onClick={handleClick}>
              {Icon}
            </Link>
          </StyledNavItem>
        </Animated>
      </NavLink>
    </div>
  );
};

export default NavItem;
