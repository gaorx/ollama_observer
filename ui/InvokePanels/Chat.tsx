import { ChatRequest, ChatResponse, Message, Tool, ToolCall } from 'ollama';
import { CSSProperties, ReactNode } from 'react';
import Markdown from 'react-markdown';
import { Card, Divider, Flex, List, Space, Tabs, Typography } from 'antd';
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
const sectionTitleSize = '1em';

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
          <Divider
            size="small"
            style={{ fontSize: sectionTitleSize }}
          >
            <Typography.Text style={{ fontWeight: 'bold' }}>Messages</Typography.Text>
          </Divider>
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
      {}
      {tools.length > 0 && (
        <>
          <Divider
            size="small"
            style={{ fontSize: sectionTitleSize }}
          >
            <Typography.Text style={{ fontWeight: 'bold' }}>Tools</Typography.Text>
          </Divider>
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
    </Card>
  );
}

export function ChatResponsePanel(props: any): ReactNode {
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
      <Divider
        size="small"
        style={{ fontSize: sectionTitleSize }}
      >
        <Typography.Text style={{ fontWeight: 'bold' }}>Message</Typography.Text>
      </Divider>
      <MessagePanel
        data={data.message}
        contentBox="markdown"
      />
    </Card>
  );
}

interface MessagePanelProps {
  data: Message;
  index?: number;
  contentBox?: 'none' | 'box' | 'markdown';
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
    } else if (contentBox === 'markdown') {
      return (
        <Card styles={{ body: { padding: '0 16px 16px 16px' } }}>
          <Tabs
            size="small"
            tabBarStyle={{ fontSize: smallTextSize }}
          >
            <Tabs.TabPane
              tab="Markdown"
              key="markdown"
            >
              <div style={{ fontSize: normalTextSize, margin: 0, padding: 0 }}>
                <Markdown>{content}</Markdown>
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
    <Flex vertical>
      {hasContent && (
        <>
          <Space style={{ marginBottom: 8 }}>
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
          {renderContent()}
        </>
      )}
      {hasThinking && (
        <>
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

function getToolFunctionName(tool: Tool): string {
  return tool.function?.name || '<unnamed>';
}

function getToolCallFunctionName(toolCall: ToolCall): string {
  return toolCall.function?.name || '<unnamed>';
}
