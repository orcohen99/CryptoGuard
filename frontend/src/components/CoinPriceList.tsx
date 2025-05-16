import React from 'react';
import styled from 'styled-components';
import type { CoinPrice } from '../services/api';

interface CoinPriceListProps {
  coins: CoinPrice[];
  onSelectCoin: (coin: CoinPrice) => void;
  selectedCoinId?: string;
}

const ListContainer = styled.div`
  background-color: #22263a;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ListTitle = styled.h3`
  color: #fff;
  margin-top: 0;
  margin-bottom: 15px;
`;

const CoinList = styled.div`
  max-height: 500px;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1d2b;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #3a3e52;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #4a4e62;
  }
`;

const CoinItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${props => props.selected ? '#2c3152' : '#1e213a'};
  border: 1px solid ${props => props.selected ? '#7b61ff' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #2c3152;
  }
`;

const CoinLogo = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 12px;
  border-radius: 50%;
`;

const CoinInfo = styled.div`
  flex: 1;
`;

const CoinName = styled.div`
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 4px;
`;

const CoinSymbol = styled.div`
  color: #888;
  font-size: 12px;
  text-transform: uppercase;
`;

const CoinPrice = styled.div`
  color: #fff;
  font-weight: 500;
  margin-right: 12px;
`;

const PriceChange = styled.div<{ positive: boolean }>`
  color: ${props => props.positive ? '#4caf50' : '#f44336'};
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${props => props.positive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
`;

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const CoinPriceList: React.FC<CoinPriceListProps> = ({ coins, onSelectCoin, selectedCoinId }) => {
  return (
    <ListContainer>
      <ListTitle>Top Cryptocurrencies</ListTitle>
      <CoinList>
        {coins.map((coin) => (
          <CoinItem 
            key={coin.id} 
            onClick={() => onSelectCoin(coin)}
            selected={selectedCoinId === coin.id}
          >
            <CoinLogo src={coin.image} alt={coin.name} />
            <CoinInfo>
              <CoinName>{coin.name}</CoinName>
              <CoinSymbol>{coin.symbol}</CoinSymbol>
            </CoinInfo>
            <CoinPrice>{formatCurrency(coin.current_price)}</CoinPrice>
            <PriceChange positive={coin.price_change_percentage_24h > 0}>
              {coin.price_change_percentage_24h > 0 ? '+' : ''}
              {coin.price_change_percentage_24h.toFixed(2)}%
            </PriceChange>
          </CoinItem>
        ))}
      </CoinList>
    </ListContainer>
  );
};

export default CoinPriceList; 