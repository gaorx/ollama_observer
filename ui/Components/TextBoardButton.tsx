import { ReactNode, useState } from 'react';
import { Button, ButtonProps, Modal } from 'antd';
import CopyButton from './CopyButton';

export interface TextBoardButtonProps extends ButtonProps {
  text: string;
}

const smallTextSize = '0.8em';
const codeFontFamily = "'SF Mono', 'Consolas', 'Menlo', 'Monaco', 'Courier New', monospace";

export default function TextBoardButton(props: TextBoardButtonProps): ReactNode {
  const { text, ...buttonProps } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const show = () => {
    setIsModalOpen(true);
  };
  const hide = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button
        {...buttonProps}
        onClick={show}
      />
      <Modal
        centered
        closable={true}
        open={isModalOpen}
        onCancel={hide}
        width="66vw"
        footer={null}
      >
        <CopyButton
          copyText={text}
          size="small"
          icon="-"
          style={{ marginBottom: 8, fontSize: smallTextSize }}
        >
          Copy
        </CopyButton>
        <div style={{ overflow: 'auto', scrollbarWidth: 'thin', width: '100%', height: '60vh' }}>
          <pre
            style={{
              width: '100%',
              fontSize: smallTextSize,
              fontFamily: codeFontFamily,
            }}
          >
            {text}
          </pre>
        </div>
      </Modal>
    </>
  );
}
