import { ReactNode, CSSProperties } from 'react';
import { css } from '@emotion/css';
import { List, Card } from 'antd';
import { Invoke } from './schema';
import { useInvokeStore } from './store';

export interface InvokeListProps {
  style?: CSSProperties;
}

export default function InvokeList(props?: InvokeListProps): ReactNode {
  const store = useInvokeStore();
  return (
    <List
      style={props?.style}
      dataSource={store.invokes}
      rowKey={(invoke) => invoke.id}
      locale={{ emptyText: 'Ollama is not currently invoked. Launch your agent to invoke it.' }}
      renderItem={(invoke) => {
        const isActivated = invoke.id === store.activitedId;
        return (
          <Card
            className={css`
              margin-bottom: 10px;
              &:hover {
                background-color: yellow;
              }
            `}
            style={{ ...(isActivated ? { backgroundColor: 'lightblue' } : {}) }}
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
            {invoke.id}
          </Card>
        );
      }}
    />
  );
}
