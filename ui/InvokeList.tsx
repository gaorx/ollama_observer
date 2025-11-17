import { ReactNode, CSSProperties } from 'react';
import { css } from '@emotion/css';
import { List, Card, Flex, Typography, Space, Button, message, Divider } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Message } from 'ollama';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Invoke, getInvokeRequestAsChatRequest } from './schema';
import { useInvokeStore } from './store';
import { useThemeToken } from './theme';

export interface InvokeListProps {
  style?: CSSProperties;
}

export default function InvokeList(props?: InvokeListProps): ReactNode {
  const store = useInvokeStore();
  return (
    <List
      style={props?.style}
      dataSource={store.matchingInvokes}
      rowKey={(invoke) => invoke.id}
      locale={{ emptyText: 'Ollama is not currently invoked. Launch your agent to invoke it.' }}
      renderItem={(invoke) => <InvokeItem invoke={invoke} />}
    />
  );
}

const smallTextSize = '0.75em';
const smallMargin = '4px';

function InvokeItem(props: { invoke: Invoke }): ReactNode {
  const { invoke } = props;
  const store = useInvokeStore();
  const themeToken = useThemeToken();
  const isActivated = invoke.id === store.activitedId;
  //console.log('****', invoke);

  return (
    <Card
      className={css`
        margin-bottom: 10px;
        &:hover {
          background-color: ${themeToken.colorPrimaryBgHover};
        }
      `}
      style={{ ...(isActivated ? { borderColor: themeToken.colorPrimaryBorderHover } : {}) }}
      styles={{
        body: { padding: 8 },
      }}
      tabIndex={-1}
      onFocus={() => {
        store.activate(invoke.id);
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowUp') {
          store.activatePrevious();
        } else if (event.key === 'ArrowDown') {
          store.activateNext();
        } else if (event.key === 'Escape') {
          store.activate('');
        }
      }}
    >
      <Flex
        justify="space-between"
        align="center"
      >
        <Space>
          <CopyToClipboard text={invoke.id}>
            <Button
              icon={<CopyOutlined />}
              size="small"
            />
          </CopyToClipboard>
          <Typography.Text strong>{invoke.path}</Typography.Text>
          <Typography.Text code>
            {getInvokeRequestAsChatRequest(invoke).model || ''}
          </Typography.Text>
        </Space>
        <Space>
          <Typography.Text type="secondary">{dayjs(invoke.at).format('HH:mm:ss')}</Typography.Text>
        </Space>
      </Flex>
      {renderRequest(invoke)}
    </Card>
  );
}

function renderRequest(invoke: Invoke): ReactNode {
  if (invoke.path === '/api/chat') {
    return renderRequestAsChat(invoke);
  } else {
    return null;
  }
}

function renderRequestAsChat(invoke: Invoke): ReactNode {
  const requestMessages = getInvokeRequestAsChatRequest(invoke).messages || [];
  return (
    <>
      {requestMessages.length > 0 && <Divider style={{ margin: `${smallMargin} 0 0 0` }} />}
      <List
        dataSource={requestMessages}
        renderItem={(msg) => {
          return (
            <List.Item style={{ padding: smallMargin }}>
              <Flex
                gap={8}
                style={{ width: '100%' }}
              >
                <Typography.Text
                  strong
                  style={{
                    display: 'block',
                    flexBasis: '20%',
                    flexShrink: 0,
                    flexGrow: 0,
                    textAlign: 'right',
                    fontSize: smallTextSize,
                  }}
                >
                  {`${msg.role} :`}
                </Typography.Text>
                <Typography.Text
                  type="secondary"
                  ellipsis
                  style={{ display: 'block', flexGrow: 1, flexBasis: 0, fontSize: smallTextSize }}
                >
                  {normalizeMessageContent(msg)}
                </Typography.Text>
              </Flex>
            </List.Item>
          );
        }}
      />
    </>
  );
}

function normalizeMessageContent(msg: Message): string {
  const content = msg.content.trim();
  if (content.length > 0) {
    return content;
  }
  if (msg.tool_calls != null && msg.tool_calls.length > 0) {
    return `<${msg.tool_calls.length} tool calls>`;
  }
  return '<empty>';
}
