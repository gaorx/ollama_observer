import { ReactNode, CSSProperties } from 'react';
import { Card, Space, Typography, Button, Flex, Tooltip, Popover, Divider } from 'antd';
import { CodeOutlined, CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AttributeList from './Components/AttributeList';
import { ChatRequestPanel, ChatResponsePanel } from './InvokePanels/Chat';
import { useInvokeStore } from './store';
import { Invoke, getInvokeRequestAsChatRequest, getInvokeResponseAsChatResponse } from './schema';

export interface InvokeDetailProps {
  style?: CSSProperties;
}

export default function InvokeDetail(props: InvokeDetailProps): ReactNode {
  const { style } = props;
  const store = useInvokeStore();
  const invoke = store.invokes.find((inv) => inv.id === store.activitedId);
  if (!invoke) {
    return <div>No invoke selected</div>;
  }
  return (
    <Space
      style={style}
      direction="vertical"
      size="large"
    >
      <InvokeHeader invoke={invoke} />
      {renderRequestPanel(invoke)}
      {renderResponsePanel(invoke)}
    </Space>
  );
}

function InvokeHeader(props: { invoke: Invoke }): ReactNode {
  const { invoke } = props;
  const largeTextSize = '1.2em';
  const smallTextSize = '0.8em';
  return (
    <Card>
      <Flex justify="space-between">
        <Space>
          <Typography.Text
            type="secondary"
            style={{ fontSize: largeTextSize }}
          >{`#${invoke.order}`}</Typography.Text>
          <Typography.Text style={{ fontWeight: 'bolder', fontSize: largeTextSize }}>
            {invoke.path}
          </Typography.Text>

          <CopyToClipboard text={invoke.id}>
            <Button
              size="small"
              style={{ fontSize: smallTextSize }}
            >
              Copy ID
            </Button>
          </CopyToClipboard>
          <CopyToClipboard text={JSON.stringify(invoke, null, 2)}>
            <Button
              size="small"
              style={{ fontSize: smallTextSize }}
            >
              Copy as JSON
            </Button>
          </CopyToClipboard>
          <Popover
            trigger="click"
            content={renderInvokeInfo(invoke)}
          >
            <Button
              size="small"
              style={{ fontSize: smallTextSize }}
            >
              Headers
            </Button>
          </Popover>
        </Space>
        <Space>
          <Typography.Text type="secondary">
            {`Completed at ${dayjs(invoke.at).format('YYYY-MM-DD HH:mm:ss')}`}
          </Typography.Text>
        </Space>
      </Flex>
    </Card>
  );
}

function renderInvokeInfo(invoke: Invoke): ReactNode {
  const width = 480;
  const textSize = '0.8em';
  const blockGap = 16;
  const keyWidth = '30%';
  const asTitle = (v: ReactNode) => <Divider>{v}</Divider>;
  const asPlain = (v: ReactNode) => (
    <Typography.Text
      type="secondary"
      style={{ fontSize: textSize }}
    >
      {v}
    </Typography.Text>
  );
  const asCode = (v: ReactNode) => (
    <Typography.Text
      code
      style={{ fontSize: textSize }}
    >
      {v}
    </Typography.Text>
  );
  const recordToAttributes = (record: Record<string, string>) => {
    return Object.entries(record).map(([k, v]) => ({
      key: `${k}:`,
      value: v,
    }));
  };
  const requestAttributes = recordToAttributes(invoke.request_header);
  const responseAttriutes = recordToAttributes(invoke.response_header);
  return (
    <>
      <AttributeList
        title={asTitle('Basic')}
        style={{ width: width, marginBottom: blockGap }}
        defaultTextSize={textSize}
        gap={8}
        keyWidth={keyWidth}
        titleRenderer={(v) => v}
        valueRenderer={(v) => v}
        data={[
          {
            key: 'ID',
            value: asCode(invoke.id),
          },
          { key: 'Method', value: asPlain(invoke.method) },
          { key: 'Path', value: asPlain(invoke.path) },
        ]}
      />
      <AttributeList
        title={asTitle('Request Headers')}
        style={{ width: width, marginBottom: blockGap }}
        defaultTextSize={textSize}
        gap={8}
        keyWidth={keyWidth}
        titleRenderer={(v) => v}
        valueRenderer={(v) => asPlain(v)}
        data={requestAttributes}
      />
      <AttributeList
        title={asTitle('Response Headers')}
        style={{ width: width, marginBottom: blockGap }}
        defaultTextSize={textSize}
        gap={8}
        keyWidth={keyWidth}
        titleRenderer={(v) => v}
        valueRenderer={(v) => asPlain(v)}
        data={responseAttriutes}
      />
    </>
  );
}

function renderRequestPanel(invoke: Invoke): ReactNode {
  if (invoke.path === '/api/chat') {
    return <ChatRequestPanel data={getInvokeRequestAsChatRequest(invoke)} />;
  } else {
    return null;
  }
}

function renderResponsePanel(invoke: Invoke): ReactNode {
  if (invoke.path === '/api/chat') {
    return <ChatResponsePanel data={getInvokeResponseAsChatResponse(invoke)} />;
  } else {
    return null;
  }
}
