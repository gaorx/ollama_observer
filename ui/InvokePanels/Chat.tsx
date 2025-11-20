import dayjs from 'dayjs';
import { ChatRequest, ChatResponse, Message, Tool, ToolCall } from 'ollama';
import { CSSProperties, ReactNode } from 'react';
import Markdown from 'react-markdown';
import { Card, Col, Divider, Flex, List, Row, Space, Tabs, Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import AttributeList from '../Components/AttributeList';
import CopyButton from '../Components/CopyButton';
import TextBoardButton from '../Components/TextBoardButton';

export interface ChatRequestPanelProps {
  style?: CSSProperties;
  data: ChatRequest;
}

export interface ChatResponsePanelProps {
  style?: CSSProperties;
  data: ChatResponse;
}

const cardTitleStyle = { fontSize: '1em', padding: 0 };
const cardBodyStyle = { padding: '16px 36px 24px 36px' };
const largeTextSize = '1.2em';
const normalTextSize = '1.0em';
const smallTextSize = '0.9em';
const smallerTextSize = '0.8em';
const sectionTitleSize = '1em';
const codeFontFamily = "'SF Mono', 'Consolas', 'Menlo', 'Monaco', 'Courier New', monospace";

export function ChatRequestPanel(props: ChatRequestPanelProps): ReactNode {
  const { data } = props;
  const { messages = [], tools = [] } = data;
  return (
    <Card styles={{ title: cardTitleStyle, body: cardBodyStyle }}>
      <Flex justify="space-between">
        <Typography.Text style={{ fontSize: largeTextSize, fontWeight: 'bolder' }}>
          Request
        </Typography.Text>
        <Space>
          <TextBoardButton
            size="small"
            style={{ fontSize: smallTextSize }}
            text={JSON.stringify(data, null, 2)}
          >
            JSON
          </TextBoardButton>
        </Space>
      </Flex>
      {messages.length > 0 && (
        <>
          {renderSectionTitle('Messages')}
          <List
            dataSource={messages}
            renderItem={(msg, index) => {
              return (
                <List.Item>
                  <MessagePanel
                    data={msg}
                    index={index + 1}
                  />
                </List.Item>
              );
            }}
          />
        </>
      )}
      {tools.length > 0 && (
        <>
          {renderSectionTitle('Tools')}
          <Space
            wrap
            size={[8, 16]}
          >
            {tools.map((tool) => (
              <TextBoardButton
                size="small"
                style={{ fontSize: smallTextSize }}
                text={JSON.stringify(tool, null, 2)}
              >
                {getToolFunctionName(tool)}
              </TextBoardButton>
            ))}
          </Space>
        </>
      )}
      {renderSectionTitle('Others')}
      <Row>
        <Col span={12}>
          <AttributeList
            gap={16}
            keyWidth="40%"
            defaultTextSize={smallerTextSize}
            data={[
              { key: 'Model', value: data.model ?? '-' },
              { key: 'Thinking', value: data.think ?? '-' },
              { key: 'Format', value: chatFormatAsString(data.format) },
            ]}
          />
        </Col>
        <Col span={12}>
          <AttributeList
            gap={8}
            keyWidth="40%"
            defaultTextSize={smallerTextSize}
            data={[
              { key: 'Stream', value: booleanAsString(data.stream) },
              { key: 'Temperature', value: data.options?.temperature ?? '-' },
            ]}
          />
        </Col>
      </Row>
    </Card>
  );
}

export function ChatResponsePanel(props: ChatResponsePanelProps): ReactNode {
  const { data } = props;
  return (
    <Card styles={{ title: cardTitleStyle, body: cardBodyStyle }}>
      <Flex justify="space-between">
        <Typography.Text style={{ fontSize: largeTextSize, fontWeight: 'bolder' }}>
          Response
        </Typography.Text>
        <Space>
          <TextBoardButton
            size="small"
            style={{ fontSize: smallTextSize }}
            text={JSON.stringify(data, null, 2)}
          >
            JSON
          </TextBoardButton>
        </Space>
      </Flex>
      {renderSectionTitle('Message')}
      <MessagePanel
        data={data.message}
        contentBox="preview"
      />
      {renderSectionTitle('Others')}
      <Row>
        <Col span={12}>
          <AttributeList
            gap={16}
            keyWidth="40%"
            defaultTextSize={smallerTextSize}
            data={[
              { key: 'Model', value: data.model ?? '-' },
              { key: 'Created at', value: dayjs(data.created_at).format('YYYY-MM-DD HH:mm:ss') },
              { key: 'Done reason', value: data.done_reason ?? '-' },
              { key: 'Total duration', value: elapsedAsString(data.total_duration) },
              { key: 'Load duration', value: elapsedAsString(data.load_duration) },
            ]}
          />
        </Col>
        <Col span={12}>
          <AttributeList
            gap={8}
            keyWidth="40%"
            defaultTextSize={smallerTextSize}
            data={[
              { key: 'Prefill duration', value: elapsedAsString(data.prompt_eval_duration) },
              { key: 'Prefill tokens', value: data.prompt_eval_count ?? '-' },
              {
                key: 'Prefill speed',
                value: elapsedTokenSpeedAsString(
                  data.prompt_eval_duration,
                  data.prompt_eval_count ?? 0
                ),
              },
              { key: 'Generation duration', value: elapsedAsString(data.eval_duration) },
              { key: 'Generation tokens', value: data.eval_count ?? '-' },
              {
                key: 'Generation speed',
                value: elapsedTokenSpeedAsString(data.eval_duration, data.eval_count ?? 0),
              },
            ]}
          />
        </Col>
      </Row>
    </Card>
  );
}

interface MessagePanelProps {
  data: Message;
  index?: number;
  contentBox?: 'none' | 'box' | 'preview';
}

function MessagePanel(props: MessagePanelProps): ReactNode {
  const { data, contentBox = 'none', index } = props;
  const { content = '', thinking = '', tool_calls: toolCalls = [] } = data;
  const hasContent = content.length > 0 || toolCalls.length > 0;
  const hasThinking = thinking.length > 0;

  const renderToolCalls = () => {
    if (toolCalls.length === 0) {
      return null;
    }
    return (
      <Space
        wrap
        size="small"
      >
        {toolCalls.map((toolCall) => (
          <TextBoardButton
            size="small"
            style={{ fontSize: smallTextSize }}
            text={JSON.stringify(toolCall, null, 2)}
          >
            {`call ${getToolCallFunctionName(toolCall)}`}
          </TextBoardButton>
        ))}
      </Space>
    );
  };

  const renderPlainContent = (withToolCalls: boolean) => {
    return (
      <Typography.Paragraph style={{ fontSize: normalTextSize, marginBottom: 0 }}>
        {content}
        {withToolCalls && renderToolCalls()}
      </Typography.Paragraph>
    );
  };

  const renderContent = () => {
    if (content.length === 0) {
      return renderToolCalls();
    }
    if (contentBox === 'none') {
      return renderPlainContent(true);
    } else if (contentBox === 'box') {
      return <Card styles={{ body: { padding: '16px' } }}>{renderPlainContent(true)}</Card>;
    } else if (contentBox === 'preview') {
      return (
        <Card styles={{ body: { padding: '0 16px 16px 16px' } }}>
          <Tabs
            size="small"
            tabBarStyle={{ fontSize: smallTextSize }}
          >
            <Tabs.TabPane
              tab="Preview"
              key="preview"
            >
              <div style={{ fontSize: normalTextSize, margin: 0, padding: 0 }}>
                {renderPreviewContent(content)}
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="Text"
              key="text"
            >
              {renderPlainContent(false)}
            </Tabs.TabPane>
          </Tabs>
          {renderToolCalls()}
        </Card>
      );
    } else {
      return null;
    }
  };

  return (
    <Flex
      vertical
      style={{ width: '100%' }}
    >
      {hasContent && (
        <>
          <Flex
            style={{ marginBottom: 8 }}
            justify="space-between"
          >
            <Space>
              {index != null && (
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: normalTextSize, marginBottom: 2 }}
                >
                  {`${index}. `}
                </Typography.Text>
              )}
              <Typography.Text
                style={{
                  fontSize: normalTextSize,
                  marginBottom: 8,
                  fontWeight: 'bold',
                }}
              >
                {`${data.role}:`}
              </Typography.Text>
            </Space>
            <Space>
              <CopyButton
                size="small"
                style={{ fontSize: smallerTextSize }}
                copyText={content}
              />
            </Space>
          </Flex>
          {renderContent()}
        </>
      )}
      {hasThinking && (
        <>
          <Flex justify="space-between">
            <Space style={{ marginTop: 24 }}>
              <Typography.Text
                style={{
                  fontSize: normalTextSize,
                  fontWeight: 'bold',
                }}
              >
                {'thinking:'}
              </Typography.Text>
            </Space>
            <Space>
              <CopyButton
                size="small"
                style={{ fontSize: smallerTextSize }}
                copyText={thinking}
              />
            </Space>
          </Flex>
          <Card
            style={{ marginLeft: '2em', marginTop: 8 }}
            styles={{ body: { padding: 24 } }}
          >
            <Typography.Text
              type="secondary"
              style={{ fontSize: smallTextSize }}
            >
              {thinking}
            </Typography.Text>
          </Card>
        </>
      )}
    </Flex>
  );
}

function renderSectionTitle(title: string): ReactNode {
  return (
    <Divider
      size="small"
      style={{ fontSize: sectionTitleSize }}
    >
      <Typography.Text style={{ fontWeight: 'bold' }}>{title}</Typography.Text>
    </Divider>
  );
}

function isJson(s: string): boolean {
  try {
    JSON.parse(s);
    return true;
  } catch {
    return false;
  }
}

function renderPreviewContent(content: string): ReactNode {
  if (isJson(content)) {
    const j = JSON.parse(content);
    return (
      <pre style={{ overflowX: 'auto', fontFamily: codeFontFamily, fontSize: normalTextSize }}>
        {JSON.stringify(j, null, 2)}
      </pre>
    );
  } else {
    return <Markdown>{content}</Markdown>;
  }
}

function getToolFunctionName(tool: Tool): string {
  return tool.function?.name || '<unnamed>';
}

function getToolCallFunctionName(toolCall: ToolCall): string {
  return toolCall.function?.name || '<unnamed>';
}

function booleanAsString(value: boolean | undefined): string {
  if (value == null) {
    return '-';
  }
  return value ? 'true' : 'false';
}

function chatFormatAsString(format: ChatRequest['format']): string {
  if (format == null) {
    return '-';
  }
  if (typeof format === 'string') {
    return format;
  }
  return JSON.stringify(format);
}

function elapsedAsString(elapsed: number): string {
  if (elapsed == null || elapsed < 0 || isNaN(elapsed)) {
    return '-';
  }
  return `${(elapsed / (1000 * 1000)).toFixed(2)} ms`;
}

function elapsedTokenSpeedAsString(elapsed: number, tokens: number): string {
  if (
    elapsed == null ||
    elapsed < 0 ||
    isNaN(elapsed) ||
    tokens == null ||
    tokens < 0 ||
    isNaN(tokens)
  ) {
    return '-';
  }
  const seconds = elapsed / (1000 * 1000 * 1000);
  return tokens > 0 ? `${(tokens / seconds).toFixed(2)} tokens/sec` : '0 tokens/sec';
}
