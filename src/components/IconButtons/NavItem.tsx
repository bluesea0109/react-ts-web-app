import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import BotBuilder from './icons/BotBuilder';
import Dashboard from './icons/Dashboard';
import FAQ from './icons/FAQ';
import ImageLabeling from './icons/ImageLabeling';
import TextLabeling from './icons/TextLabeling';
import Organization from './icons/Organization';
import Configuration from './icons/Configuration';
import Training from './icons/Training';
import Launching from './icons/Launching';

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
  keyVal: number;
  css: string;
  hidden: boolean;
  onClick: (key: number) => void;
}

const NavItem = (props: NavItemProps) => {
  const { active, path, onClick, keyVal, hidden } = props;
  const handleClick = () => {
    onClick(keyVal);
  };

  let Icon = null;

  switch (props.css) {
    case 'Dashboard':
      Icon = <Dashboard active={active} />;
      break;
    case 'Organization':
      Icon = <Organization active={active} />;
      break;
    case 'FAQ':
      Icon = <FAQ active={active} />;
      break;
    case 'ImageLabeling':
      Icon = <ImageLabeling active={active} />;
      break;
    case 'TextLabeling':
      Icon = <TextLabeling active={active} />;
      break;
    case 'BotBuilder':
      Icon = <BotBuilder active={active} />;
      break;
    case 'Configuration':
      Icon = <Configuration active={active} />;
      break;
    case 'Training':
      Icon = <Training active={active} />;
      break;
    case 'Launching':
      Icon = <Launching active={active} />;
      break;
    default:
      break;
  }

  return (
    <StyledNavItem
      active={active}
      className={active ? 'active' : ''}
      style={
        keyVal > 5
          ? hidden
            ? { display: 'none' }
            : {                
                backgroundColor: '#ffffff32',
              }
          : {}
      }>
      <Link to={path} onClick={handleClick}>
        {Icon}
      </Link>
    </StyledNavItem>
  );
};

export default NavItem;
