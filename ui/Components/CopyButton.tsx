import { ReactNode } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, ButtonProps, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

export interface CopyButtonProps extends ButtonProps {
  copyText: string;
}

export default function CopyButton(props: CopyButtonProps): ReactNode {
  let { icon = <CopyOutlined />, copyText } = props;
  if (icon === '-') {
    icon = null;
  }
  const [messageApi, contextHolder] = message.useMessage();
  const onCopy = () => {
    messageApi.success('Copied to clipboard');
  };
  return (
    <>
      {contextHolder}
      <CopyToClipboard
        text={copyText}
        onCopy={() => {
          messageApi.success('Copied to clipboard');
        }}
      >
        <Button
          {...props}
          icon={icon}
        />
      </CopyToClipboard>
    </>
  );
}
