import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #151728;
  padding: 12px 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? '#ffffff' : '#9ab')};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #333;
  margin: 0;
  width: 100%;
`;

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <Nav>
        <NavLink to="/" $active={location.pathname === '/'}>
          Home
        </NavLink>
        <NavLink to="/login" $active={location.pathname === '/login'}>
          Login
        </NavLink>
        <NavLink to="/dashboard" $active={location.pathname === '/dashboard'}>
          Dashboard
        </NavLink>
        <NavLink to="/logs" $active={location.pathname === '/logs'}>
          Logs
        </NavLink>
      </Nav>
      <Divider />
    </>
  );
};

export default Navbar; 