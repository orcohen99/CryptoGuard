import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../services/AuthContext';
import { api, Transaction, DashboardData, CoinPrice, HistoricalPriceData } from '../services/api';
import CoinPriceChart from '../components/CoinPriceChart';
import CoinPriceList from '../components/CoinPriceList';
import MultiCoinChart from '../components/MultiCoinChart';

const DashboardWrapper = styled.div`
  display: flex;
  min-height: calc(100vh - 60px);
  background-color: #0f111a;
  color: #e0e0e0;
`;

const Sidebar = styled.div`
  width: 220px;
  background-color: #151728;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 40px;
  background-color: #1a1d2b;
  overflow-y: auto;
`;

const WelcomeHeader = styled.h1`
  color: #ffffff;
  margin-bottom: 20px;
`;

const Cards = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  flex: 1;
  background-color: #22263a;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  margin: 0 0 10px;
  color: #fff;
`;

const CardContent = styled.p`
  font-size: 18px;
  color: #c0c0c0;
`;

const SectionTitle = styled.h2`
  color: #ffffff;
  margin-top: 40px;
  margin-bottom: 20px;
`;

const TransactionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #202435;
  color: #fff;
  border: 1px solid #333;
  padding: 10px;
  text-align: center;
`;

const TableCell = styled.td`
  border: 1px solid #333;
  padding: 10px;
  text-align: center;
  color: #ccc;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #181b29;
  }

  &:hover {
    background-color: #2a2d40;
  }
`;

const Clock = styled.div`
  text-align: right;
  font-size: 14px;
  margin-bottom: 10px;
`;

const SpinnerContainer = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 123, 255, 0.2);
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const CryptoSection = styled.div`
  margin-top: 40px;
  margin-bottom: 40px;
`;

const ChartsContainer = styled.div`
  margin-bottom: 30px;
`;

const CryptoGridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 20px;
`;

const formatDateTime = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleString();
};

const truncateAddress = (address: string) => {
  return `${address.substring(0, 12)}...`;
};

// Array of popular cryptocurrencies with their colors for charts
const COIN_COLORS: Record<string, string> = {
  bitcoin: '#F7931A',
  ethereum: '#627EEA',
  binancecoin: '#F3BA2F',
  ripple: '#0085C0',
  cardano: '#0033AD',
  solana: '#00FFA3',
  polkadot: '#E6007A',
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  // Crypto state
  const [topCoins, setTopCoins] = useState<CoinPrice[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinPrice | null>(null);
  const [coinHistory, setCoinHistory] = useState<HistoricalPriceData | null>(null);
  const [loadingCoinData, setLoadingCoinData] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }

    // Get dashboard data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch wallet transactions
        const data = await api.getDashboard(user.wallet);
        setDashboardData(data);
        
        // Fetch top coins
        const coins = await api.getTopCoins(10);
        setTopCoins(coins);
        
        // Set initial selected coin and fetch its history
        if (coins.length > 0) {
          setSelectedCoin(coins[0]);
          const history = await api.getCoinHistory(coins[0].id);
          setCoinHistory(history);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Update clock
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, [user, navigate]);

  // Handle coin selection
  const handleSelectCoin = async (coin: CoinPrice) => {
    setSelectedCoin(coin);
    setLoadingCoinData(true);
    
    try {
      const history = await api.getCoinHistory(coin.id);
      setCoinHistory(history);
    } catch (error) {
      console.error('Error fetching coin history:', error);
    } finally {
      setLoadingCoinData(false);
    }
  };

  if (!user) {
    return null; // will redirect in useEffect
  }

  return (
    <>
      <DashboardWrapper>
        <Sidebar>
          <h2>CryptoGuard</h2>
        </Sidebar>

        <MainContent>
          <WelcomeHeader>Welcome, {user.username}</WelcomeHeader>

          {dashboardData && (
            <>
              <Cards>
                <Card>
                  <CardTitle>Wallet</CardTitle>
                  <CardContent>{truncateAddress(dashboardData.wallet)}</CardContent>
                </Card>
                <Card>
                  <CardTitle>Transactions</CardTitle>
                  <CardContent>{dashboardData.transaction_count}</CardContent>
                </Card>
                <Card>
                  <CardTitle>Total ETH Sent</CardTitle>
                  <CardContent>{dashboardData.total_eth_sent}</CardContent>
                </Card>
              </Cards>

              <Clock>Current time: <span>{currentTime}</span></Clock>

              {/* Cryptocurrency Charts Section */}
              <CryptoSection>
                <SectionTitle>Cryptocurrency Market</SectionTitle>
                <CryptoGridLayout>
                  <ChartsContainer>
                    {selectedCoin && coinHistory && (
                      <CoinPriceChart 
                        data={coinHistory} 
                        coinName={selectedCoin.name} 
                        color={COIN_COLORS[selectedCoin.id] || '#7b61ff'} 
                      />
                    )}
                    {topCoins.length > 0 && (
                      <MultiCoinChart 
                        coins={topCoins.slice(0, 5)} 
                        title="Top 5 Cryptocurrencies Comparison" 
                      />
                    )}
                    {loadingCoinData && (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        height: '100px'
                      }}>
                        <Spinner />
                      </div>
                    )}
                  </ChartsContainer>
                  <CoinPriceList 
                    coins={topCoins} 
                    onSelectCoin={handleSelectCoin} 
                    selectedCoinId={selectedCoin?.id} 
                  />
                </CryptoGridLayout>
              </CryptoSection>

              <SectionTitle>Recent Transactions</SectionTitle>
              {dashboardData.transactions.length > 0 ? (
                <TransactionTable>
                  <thead>
                    <tr>
                      <TableHeader>Hash</TableHeader>
                      <TableHeader>From</TableHeader>
                      <TableHeader>To</TableHeader>
                      <TableHeader>Value (ETH)</TableHeader>
                      <TableHeader>Time</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.transactions.map((tx: Transaction) => (
                      <TableRow key={tx.hash}>
                        <TableCell>{truncateAddress(tx.hash)}</TableCell>
                        <TableCell>{truncateAddress(tx.from)}</TableCell>
                        <TableCell>{truncateAddress(tx.to)}</TableCell>
                        <TableCell>{(parseFloat(tx.value) / 10**18).toFixed(4)}</TableCell>
                        <TableCell>{formatDateTime(tx.timeStamp)}</TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </TransactionTable>
              ) : (
                <p>No transactions found for this wallet.</p>
              )}
            </>
          )}
        </MainContent>
      </DashboardWrapper>

      <SpinnerContainer visible={isLoading}>
        <Spinner />
      </SpinnerContainer>
    </>
  );
};

export default DashboardPage; 