import dayjs from 'dayjs';
import { CSSProperties, ReactNode } from 'react';
import { Button, Card, Divider, Empty, Flex, Popover, Space, Typography } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import AttributeList from './Components/AttributeList';
import CopyButton from './Components/CopyButton';
import TextBoardButton from './Components/TextBoardButton';
import { ChatRequestPanel, ChatResponsePanel } from './InvokePanels/Chat';
import { Invoke, getInvokeRequestAsChatRequest, getInvokeResponseAsChatResponse } from './schema';
import { useInvokeStore } from './store';
import { selectTheme, useThemeStore } from './theme';

export interface InvokeDetailProps {
  style?: CSSProperties;
}

export default function InvokeDetail(props: InvokeDetailProps): ReactNode {
  const { style } = props;
  const store = useInvokeStore();
  const currentTheme = useThemeStore(selectTheme);
  const invoke = store.invokes.find((inv) => inv.id === store.activitedId);
  if (!invoke) {
    return (
      <Flex
        vertical
        align="center"
        justify="center"
        style={{ height: '66%' }}
      >
        <Empty
          image={false}
          description={false}
        >
          <Typography.Text style={{ color: currentTheme.colorEmpty }}>
            {'Select an Invoke on the left.'}
          </Typography.Text>
        </Empty>
      </Flex>
    );
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

const largeTextSize = '1.2em';
const smallTextSize = '0.9em';

function InvokeHeader(props: { invoke: Invoke }): ReactNode {
  const { invoke } = props;
  return (
    <Card>
      <Flex justify="space-between">
        <Space>
          <Typography.Text
            type="secondary"
            style={{ fontSize: largeTextSize }}
          >{`#${invoke.order}`}</Typography.Text>
          <Typography.Text style={{ fontSize: largeTextSize, fontWeight: 'bolder' }}>
            {invoke.path}
          </Typography.Text>
          <Typography.Text
            type="secondary"
            style={{ fontSize: smallTextSize }}
          >
            {`Completed at ${dayjs(invoke.at).format('YYYY-MM-DD HH:mm:ss')}`}
          </Typography.Text>
        </Space>
        <Space>
          <Popover
            trigger="click"
            placement="bottomRight"
            content={renderInvokeInfo(invoke)}
          >
            <Button
              size="small"
              style={{ fontSize: smallTextSize }}
              icon={<CaretDownOutlined />}
              iconPosition="end"
            >
              Headers
            </Button>
          </Popover>
          <CopyButton
            size="small"
            style={{ fontSize: smallTextSize }}
            copyText={invoke.id}
          >
            ID
          </CopyButton>
          <TextBoardButton
            size="small"
            style={{ fontSize: smallTextSize }}
            text={JSON.stringify(invoke, null, 2)}
          >
            JSON
          </TextBoardButton>
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
