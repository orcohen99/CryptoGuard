import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Base styles */
  body {
    background-color: #0e0e2c;
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    color: #e0e0e0;
    min-height: 100vh;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    color: #ffffff;
    margin-top: 0;
  }

  h2 {
    font-size: 28px;
    margin-bottom: 25px;
  }

  /* Links */
  a {
    color: #7b61ff;
    text-decoration: none;
    transition: color 0.2s;
  }

  a:hover {
    color: #ffffff;
  }

  /* Form elements */
  input, textarea, select {
    background-color: #2a2a4f;
    color: #e0e0e0;
    border: 1px solid #7b61ff;
    padding: 10px;
    border-radius: 6px;
    width: 100%;
    font-family: inherit;
    box-sizing: border-box;
  }

  button {
    background-color: #7b61ff;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.3s ease;
  }

  button:hover {
    background-color: #5a43cc;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    border: 1px solid #333;
    padding: 10px;
    text-align: center;
  }

  th {
    background-color: #202435;
    color: #fff;
  }

  tr:nth-child(even) {
    background-color: #181b29;
  }

  tr:hover {
    background-color: #2a2d40;
  }
`;

export default GlobalStyles; 