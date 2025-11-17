import { CSSProperties, ReactNode } from 'react';
import { css } from '@emotion/css';
import { ReloadOutlined, ClearOutlined } from '@ant-design/icons';
import { Flex, Button, Space, Tooltip, theme } from 'antd';
import { useInvokeStore } from './store';
import ollamaLogo from './ollama.png';
import { useThemeToken } from './theme';

export interface ToolbarProps {
  style?: CSSProperties;
}

const logoWH = 44;
export default function Toolbar(props?: ToolbarProps): ReactNode {
  const invokeStore = useInvokeStore();
  return (
    <Flex
      justify="space-between"
      className={css`
        align-items: center;
      `}
    >
      <div
        style={{
          margin: 0,
          padding: 0,
          height: logoWH,
          width: logoWH,
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 16,
        }}
      >
        <img
          src={ollamaLogo}
          alt="ollama"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
      <Space>
        <Tooltip title="Reload invokes">
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              invokeStore.fetchAll();
            }}
          />
        </Tooltip>
        <Tooltip title="Clear invokes">
          <Button
            icon={<ClearOutlined />}
            onClick={() => {
              invokeStore.clear();
            }}
          />
        </Tooltip>
      </Space>
    </Flex>
  );
}
