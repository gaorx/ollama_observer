import { ReactNode, useEffect, useRef } from 'react';
import { ConfigProvider, Flex, Input, Layout, theme } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import InvokeDetail from './InvokeDetail';
import InvokeList from './InvokeList';
import Toolbar from './Toolbar';
import { useInvokeStore } from './store';
import { isDarkTheme, selectTheme, useThemeStore } from './theme';

const panelPadding = '24px 28px';

function App(): ReactNode {
  const invokeStore = useInvokeStore();
  const isDark = useThemeStore(isDarkTheme);
  const currentTheme = useThemeStore(selectTheme);
  const bottomRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      await invokeStore.fetchAll();
    })();
    invokeStore.startPull();
  }, []);
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontSize: 16,
          borderRadius: 10,
          colorPrimary: '#9149f7',
        },
        components: {
          Layout: {
            colorBgLayout: currentTheme.colorBg,
            siderBg: currentTheme.colorBg,
          },
        },
      }}
    >
      <Layout style={{ height: '100vh' }}>
        <Layout.Sider
          width="30%"
          style={{ padding: panelPadding }}
        >
          <Flex
            style={{ height: '100%' }}
            gap={24}
            vertical
          >
            <Toolbar bottomRef={bottomRef} />
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
            <div style={{ flexGrow: 1, overflowY: 'auto', scrollbarWidth: 'thin', padding: 2 }}>
              <InvokeList />
              <div
                ref={bottomRef}
                style={{ height: 0, width: '100%' }}
              />
            </div>
          </Flex>
        </Layout.Sider>
        <Layout.Content style={{ padding: panelPadding, maxHeight: '100vh', overflowY: 'auto' }}>
          <InvokeDetail style={{ width: '100%' }} />
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
