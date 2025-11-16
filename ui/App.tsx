import { ReactNode, useEffect } from 'react';
import { Input, Splitter, Flex } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Toolbar from './Toolbar';
import InvokeList from './InvokeList';
import InvokeDetail from './InvokeDetail';
import { useInvokeStore } from './store';

function App(): ReactNode {
  const invokeStore = useInvokeStore();

  useEffect(() => {
    (async () => {
      await invokeStore.fetchAll();
    })();
    invokeStore.startPull();
  }, []);

  return (
    <Splitter style={{ height: '100vh' }}>
      <Splitter.Panel
        defaultSize="25%"
        min="20%"
        max="50%"
        style={{ padding: '24px 28px' }}
      >
        <Flex
          style={{ height: '100%' }}
          gap={24}
          vertical
        >
          <Toolbar />
          <Input
            placeholder="Search in invokes"
            prefix={<SearchOutlined />}
            style={{ borderRadius: 16, paddingBlock: 10 }}
          />
          <InvokeList style={{ flexGrow: 1 }} />
        </Flex>
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: '24px 28px' }}>
        <InvokeDetail />
      </Splitter.Panel>
    </Splitter>
  );
}

export default App;
