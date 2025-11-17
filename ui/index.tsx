import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';
import App from './App';
import './index.css';
import { getThemeId } from './theme';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const themeId = getThemeId();
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: themeId === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontSize: 16,
          borderRadius: 10,
          colorPrimary: '#9149f7',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
