import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart
} from 'recharts';
import styled from 'styled-components';
import { HistoricalPriceData } from '../services/api';

interface CoinPriceChartProps {
  data: HistoricalPriceData;
  coinName: string;
  color?: string;
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
  margin-bottom: 5px;
`;

const TooltipPrice = styled.div`
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
`;

const CoinPriceChart: React.FC<CoinPriceChartProps> = ({ data, coinName, color = '#7b61ff' }) => {
  if (!data.prices || data.prices.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>{coinName} Price Chart</ChartTitle>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          No data available
        </div>
      </ChartContainer>
    );
  }

  // Format the data for Recharts
  const chartData = data.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp),
    price,
  }));

  // Custom tooltip component
  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <TooltipDate>{new Date(label).toLocaleDateString()} {new Date(label).toLocaleTimeString()}</TooltipDate>
          <TooltipPrice>${payload[0].value.toFixed(2)}</TooltipPrice>
        </CustomTooltip>
      );
    }
    return null;
  };

  return (
    <ChartContainer>
      <ChartTitle>{coinName} Price Chart</ChartTitle>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id={`colorPrice${coinName}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()} 
            stroke="#666"
            tick={{ fill: '#888', fontSize: 12 }}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            tick={{ fill: '#888', fontSize: 12 }}
            stroke="#666"
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <Tooltip content={renderTooltip} />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            fillOpacity={1} 
            fill={`url(#colorPrice${coinName})`} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default CoinPriceChart; 