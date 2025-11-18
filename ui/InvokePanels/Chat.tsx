import { ReactNode, CSSProperties } from 'react';
import { Card, Divider, Typography } from 'antd';
import { ChatRequest, ChatResponse } from 'ollama';

export interface ChatRequestPanelProps {
  style?: CSSProperties;
  data: ChatRequest;
}

export interface ChatResponsePanelProps {
  style?: CSSProperties;
  data: ChatResponse;
}

const cardTitleStyle = { fontSize: '1em', padding: 0 };
const cardBodyStyle = { paddingTop: 8, paddingBottom: 8 };

export function ChatRequestPanel(props: ChatRequestPanelProps): ReactNode {
  return (
    <Card styles={{ title: cardTitleStyle, body: cardBodyStyle }}>
      <div style={{ textAlign: 'center' }}>
        <Typography.Text strong>Request</Typography.Text>
      </div>
      Chat Request Panel
    </Card>
  );
}

export function ChatResponsePanel(props: any): ReactNode {
  return (
    <Card styles={{ title: cardTitleStyle, body: cardBodyStyle }}>
      <div style={{ textAlign: 'center' }}>
        <Typography.Text strong>Response</Typography.Text>
      </div>
      Chat Response Panel
    </Card>
  );
}
