import axios from 'axios';

const API_URL = 'http://localhost:5001';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // For session cookies if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// CoinGecko API client
const coinGeckoClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface for login response
export interface LoginResponse {
  success: boolean;
  username?: string;
  wallet?: string;
  message?: string;
}

// Interface for transaction data
export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  // Add other fields as needed
}

// Interface for dashboard data
export interface DashboardData {
  wallet: string;
  transaction_count: number;
  total_eth_sent: number;
  transactions: Transaction[];
}

// Interface for cryptocurrency price data
export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
}

// Interface for historical price data
export interface HistoricalPriceData {
  prices: [number, number][];  // [timestamp, price] pairs
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// API functions
export const api = {
  // Login
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/api/login', { username, password });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as LoginResponse;
      }
      return { success: false, message: 'Network error' };
    }
  },

  // Get dashboard data
  getDashboard: async (wallet: string): Promise<DashboardData> => {
    const response = await apiClient.get(`/api/dashboard?wallet=${wallet}`);
    return response.data;
  },

  // Get logs
  getLogs: async (): Promise<Transaction[]> => {
    const response = await apiClient.get('/api/logs');
    return response.data;
  },
  
  // Get top cryptocurrencies by market cap
  getTopCoins: async (count: number = 10): Promise<CoinPrice[]> => {
    try {
      const response = await coinGeckoClient.get(
        `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=false&price_change_percentage=24h,7d`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching top coins:', error);
      return [];
    }
  },
  
  // Get historical price data for a specific coin
  getCoinHistory: async (coinId: string, days: number = 7): Promise<HistoricalPriceData> => {
    try {
      const response = await coinGeckoClient.get(
        `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching history for ${coinId}:`, error);
      return { prices: [], market_caps: [], total_volumes: [] };
    }
  }
};

export default api; 