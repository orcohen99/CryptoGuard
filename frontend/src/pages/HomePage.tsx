import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  min-height: 80vh;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #fff;
  text-shadow: 0 0 10px rgba(123, 97, 255, 0.7);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #bbb;
  margin-bottom: 2rem;
  text-align: center;
  max-width: 600px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const StyledButton = styled(Link)`
  padding: 0.8rem 2rem;
  background-color: #7b61ff;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #5b46cc;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(123, 97, 255, 0.4);
  }
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <Title>Welcome to CryptoGuard</Title>
      <Subtitle>
        Monitor and analyze your cryptocurrency transactions with our advanced security and visualization tools.
      </Subtitle>
      <ButtonContainer>
        <StyledButton to="/login">Login</StyledButton>
        <StyledButton to="/dashboard">Dashboard</StyledButton>
      </ButtonContainer>
    </HomeContainer>
  );
};

export default HomePage; 