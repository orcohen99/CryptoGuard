import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import styled from 'styled-components';
import type { CoinPrice } from '../services/api';

interface ChartPoint {
  date: string;
  [key: string]: string | number;
}

interface MultiCoinChartProps {
  coins: CoinPrice[];
  title?: string;
}

const ChartContainer = styled.div`
  background-color: #22263a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  height: 300px;
`;

const ChartTitle = styled.h3`
  color: #fff;
  margin-top: 0;
  margin-bottom: 15px;
`;

const CustomTooltip = styled.div`
  background-color: #2c2f45;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #3f4256;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
`;

const TooltipDate = styled.div`
  color: #b7b7b7;
  font-size: 12px;
  margin-bottom: 8px;
`;

const TooltipItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  &:before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 8px;
    background-color: ${props => props.color};
    border-radius: 50%;
  }
`;

const TooltipLabel = styled.span`
  color: #e0e0e0;
  margin-right: 8px;
  font-weight: 500;
`;

const TooltipValue = styled.span`
  color: #ffffff;
  font-weight: bold;
`;

// Map for coin colors
const COIN_COLORS: Record<string, string> = {
  bitcoin: '#F7931A',
  ethereum: '#627EEA',
  binancecoin: '#F3BA2F',
  ripple: '#0085C0',
  cardano: '#0033AD',
  solana: '#00FFA3',
  polkadot: '#E6007A',
  dogecoin: '#BA9F33',
  litecoin: '#345D9D',
  avalanche: '#E84142'
};

// Get a color for a coin, with fallback
const getCoinColor = (coinId: string): string => {
  return COIN_COLORS[coinId] || `hsl(${Math.random() * 360}, 70%, 50%)`;
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const MultiCoinChart: React.FC<MultiCoinChartProps> = ({ coins, title = 'Price Comparison' }) => {
  if (!coins || coins.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>{title}</ChartTitle>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          No data available
        </div>
      </ChartContainer>
    );
  }

  // Generate synthetic data for comparison
  // In a real app, you'd fetch historical data for each coin
  const generateData = () => {
    const today = new Date();
    const data = [];
    
    // Create 7 days of data
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const point: ChartPoint = {
        date: date.toLocaleDateString(),
      };
      
      // Add price for each coin
      coins.forEach(coin => {
        // Create some random variation (-3% to +3%) around the current price
        const variance = 0.97 + Math.random() * 0.06;
        point[coin.symbol] = Number((coin.current_price * variance).toFixed(2));
      });
      
      data.push(point);
    }
    
    return data;
  };

  const chartData = generateData();

  // Custom tooltip component
  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <TooltipDate>{label}</TooltipDate>
          {payload.map((entry: any) => (
            <TooltipItem key={entry.name} color={entry.color}>
              <TooltipLabel>{entry.name.toUpperCase()}</TooltipLabel>
              <TooltipValue>{formatNumber(entry.value)}</TooltipValue>
            </TooltipItem>
          ))}
        </CustomTooltip>
      );
    }
    return null;
  };

  return (
    <ChartContainer>
      <ChartTitle>{title}</ChartTitle>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            tick={{ fill: '#888', fontSize: 12 }}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            tick={{ fill: '#888', fontSize: 12 }}
            stroke="#666"
            tickFormatter={(value) => value > 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`}
          />
          <Tooltip content={renderTooltip} />
          <Legend />
          
          {coins.map(coin => (
            <Line
              key={coin.id}
              type="monotone"
              dataKey={coin.symbol}
              name={coin.symbol}
              stroke={getCoinColor(coin.id)}
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default MultiCoinChart; 