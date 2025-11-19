import { CSSProperties, ReactNode, RefObject } from 'react';
import { css } from '@emotion/css';
import { Button, Flex, Space, Tooltip, Typography } from 'antd';
import {
  ClearOutlined,
  MoonOutlined,
  ReloadOutlined,
  SunOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import ollamaLogo from './ollama.png';
import { useInvokeStore } from './store';
import { isDarkTheme, useThemeStore } from './theme';

export interface ToolbarProps {
  style?: CSSProperties;
  bottomRef?: RefObject<HTMLElement>;
}

const logoWH = 44;
export default function Toolbar(props: ToolbarProps): ReactNode {
  const { style, bottomRef } = props;
  const invokeStore = useInvokeStore();
  const themeStore = useThemeStore();
  const isDark = useThemeStore(isDarkTheme);
  return (
    <Flex
      justify="space-between"
      className={css`
        align-items: center;
      `}
      style={style}
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
      <Typography.Text style={{ fontSize: '1.4em', fontWeight: 'bolder' }}>
        Observer
      </Typography.Text>
      <Space>
        <Space.Compact>
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
        </Space.Compact>
        <Tooltip title="Goto latest invoke">
          <Button
            icon={<VerticalAlignBottomOutlined />}
            onClick={() => {
              bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </Tooltip>
        <Button
          icon={isDark ? <MoonOutlined /> : <SunOutlined />}
          onClick={() => {
            themeStore.toggleTheme();
          }}
        />
      </Space>
    </Flex>
  );
}
