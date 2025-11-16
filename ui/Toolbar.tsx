import { CSSProperties, ReactNode } from 'react';
import { css } from '@emotion/css';
import { ReloadOutlined, ClearOutlined } from '@ant-design/icons';
import { Flex, Button, Space, Tooltip } from 'antd';
import ollamaLogo from './ollama.png';

export interface ToolbarProps {
  style?: CSSProperties;
}

export default function Toolbar(props?: ToolbarProps): ReactNode {
  return (
    <Flex
      justify="space-between"
      className={css`
        align-items: center;
      `}
    >
      <img
        src={ollamaLogo}
        alt="ollama"
        style={{ width: 'auto', height: 44 }}
      />
      <Space>
        <Tooltip title="Reload invokes">
          <Button icon={<ReloadOutlined />} />
        </Tooltip>
        <Tooltip title="Clear invokes">
          <Button icon={<ClearOutlined />} />
        </Tooltip>
      </Space>
    </Flex>
  );
}
