# OLLAMA observer

调试用途的OLLAMA反向代理服务器，用于观察ollama API的request与response，来确定Agent的底层行为。

## 使用

- 启动代理服务`ollamao -r xxxxx:11434`，此后在`11435`端口监听
- 将原来指向`xxxxx:11434`的ollama地址指向`localhost:11435`
- 用浏览器打开`http://localhost:11435/o`来观察调用

## API

- `/api/observer/all` 列出所有的最近的API调用
- `/api/observer/ids` 列出所有的最近API调用的ID
- `/api/observer/get` 通过ID获取某次API调用信息

## 开发

```bash
# 编译，文件输出在dist/ollamao
make build

# 清理
make clean

# 编译并运行
./run.sh -r <OLLAMA_HOST>:11434
```
