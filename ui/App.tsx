import { Button, Splitter } from 'antd';

const defaultPadding = 16;

function App() {
  return (
    <Splitter style={{ minHeight: '100vh' }}>
      <Splitter.Panel
        defaultSize="25%"
        min="20%"
        max="50%"
        style={{ padding: defaultPadding }}
      >
        <h1>Ollama Observer</h1>
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: defaultPadding }}>
        <Button type="primary">Click Me</Button>
      </Splitter.Panel>
    </Splitter>
  );
}

export default App;
