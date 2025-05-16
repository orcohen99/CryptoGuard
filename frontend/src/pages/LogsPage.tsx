import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Transaction, api } from '../services/api';

const LogsContainer = styled.div`
  padding: 2rem;
  background-color: #1a1d2b;
  min-height: calc(100vh - 60px);
`;

const LogsTitle = styled.h2`
  color: #ffffff;
  margin-bottom: 2rem;
`;

const LogsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  background-color: #202435;
  color: #fff;
  border: 1px solid #333;
  padding: 12px;
  text-align: center;
`;

const TableCell = styled.td`
  border: 1px solid #333;
  padding: 12px;
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

const NoLogsMessage = styled.p`
  color: #e0e0e0;
  text-align: center;
  margin-top: 2rem;
  font-size: 1.2rem;
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

const formatDateTime = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleString();
};

const truncateAddress = (address: string) => {
  return `${address.substring(0, 12)}...`;
};

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await api.getLogs();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <>
      <LogsContainer>
        <LogsTitle>Stored Wallet Logs</LogsTitle>
        
        {logs.length > 0 ? (
          <LogsTable>
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
              {logs.map((log) => (
                <TableRow key={log.hash}>
                  <TableCell>{truncateAddress(log.hash)}</TableCell>
                  <TableCell>{truncateAddress(log.from)}</TableCell>
                  <TableCell>{truncateAddress(log.to)}</TableCell>
                  <TableCell>{(parseFloat(log.value) / 10**18).toFixed(4)}</TableCell>
                  <TableCell>{formatDateTime(log.timeStamp)}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </LogsTable>
        ) : (
          !isLoading && <NoLogsMessage>No logs found in MongoDB.</NoLogsMessage>
        )}
      </LogsContainer>
      
      <SpinnerContainer visible={isLoading}>
        <Spinner />
      </SpinnerContainer>
    </>
  );
};

export default LogsPage; 