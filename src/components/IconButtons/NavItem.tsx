import React, { Children, ReactElement } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import styled from 'styled-components';
import SubMenuIcon from './SubMenuIcon';

const StyledNavItem = styled.div`
  height: 50px;
  width: 50px; /* width must be same size as NavBar to center */
  text-align: center; /* Aligns <a> inside of NavIcon div */
	margin: 10px 0px 25px 0px; /* Puts space between NavItems */
	margin-right: 25px;
  a {
    font-size: 2.7em;
    color: ${(props: { active: boolean }) =>
      props.active ? 'white' : '#9FFFCB'};
    :hover {
      opacity: 0.7;
      text-decoration: none; /* Gets rid of underlining of icons */
		}
	border-right: 5px solid ${(props: { active: boolean }) =>
  props.active ? '#4A90E2' : 'none'};
  }
`;

interface NavItemProps {
  active: boolean;
  path: string;
  keyVal: number;
  css: string;
  onClick: (key: number) => void;
}

const NavItem = (props: NavItemProps) => {
  const { active, path, onClick, keyVal } = props;
  const handleClick = () => {
    onClick(keyVal);
  };

  return (
    <StyledNavItem active={active} className={active ? 'active' : ''}>
      <Link to={path} onClick={handleClick}>
        <SubMenuIcon title={props.css} />
      </Link>
    </StyledNavItem>
  );
};

export default NavItem;
