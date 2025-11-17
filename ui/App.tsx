import { ReactNode, use, useEffect } from 'react';
import { Input, Splitter, Flex } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Toolbar from './Toolbar';
import InvokeList from './InvokeList';
import InvokeDetail from './InvokeDetail';
import { useInvokeStore } from './store';
import { useThemeToken } from './theme';

const panelPadding = '24px 28px';

function App(): ReactNode {
  const themeToken = useThemeToken();
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
        style={{ padding: panelPadding, backgroundColor: themeToken.colorBgContainer }}
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
            allowClear
            style={{ borderRadius: 16, paddingBlock: 10 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const keyword = e.currentTarget.value.trim();
                invokeStore.setSearchKeyword(keyword);
              }
            }}
            onClear={() => {
              invokeStore.setSearchKeyword('');
            }}
          />
          <InvokeList style={{ flexGrow: 1 }} />
        </Flex>
      </Splitter.Panel>
      <Splitter.Panel
        style={{ padding: panelPadding, backgroundColor: themeToken.colorBgContainer }}
      >
        <InvokeDetail />
      </Splitter.Panel>
    </Splitter>
  );
}

export default App;
