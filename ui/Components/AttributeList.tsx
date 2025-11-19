import { CSSProperties, ReactNode } from 'react';
import { Flex, List, Typography } from 'antd';

export interface AttributeListProps {
  data: Array<{ key: ReactNode; value: ReactNode }>;
  title?: ReactNode;
  gap?: number | string;
  style?: CSSProperties;
  keyWidth?: number | string;
  itemStyle?: CSSProperties;
  itemRenderer?: (node: ReactNode) => ReactNode;
  titleRenderer?: (title: ReactNode) => ReactNode;
  keyRenderer?: (key: ReactNode) => ReactNode;
  valueRenderer?: (value: ReactNode) => ReactNode;
  defaultTextSize?: string | number;
}

export default function AttributeList(props: AttributeListProps): ReactNode {
  const {
    data,
    title,
    gap,
    style,
    keyWidth = '20%',
    itemStyle,
    itemRenderer: itemWrapper = (node) => node,
    titleRenderer,
    keyRenderer,
    valueRenderer,
    defaultTextSize,
  } = props;

  const defaultTitleRenderer = (title: ReactNode) => {
    return (
      <Typography.Text style={{ fontSize: '1em', fontWeight: 'bold' }}>{title}</Typography.Text>
    );
  };

  const defaultKeyRenderer = (key: ReactNode) => {
    return (
      <Typography.Text style={{ fontSize: defaultTextSize, fontWeight: 'bold' }}>
        {key}
      </Typography.Text>
    );
  };

  const defaultValueRenderer = (value: ReactNode) => {
    return (
      <Typography.Text
        type="secondary"
        ellipsis
        style={{ fontSize: defaultTextSize }}
      >
        {value}
      </Typography.Text>
    );
  };
  const titleRenderer1 = titleRenderer || defaultTitleRenderer;
  const keyRenderer1 = keyRenderer || defaultKeyRenderer;
  const valueRenderer1 = valueRenderer || defaultValueRenderer;

  return (
    <div>
      {title && titleRenderer1(title)}
      <List
        dataSource={data}
        style={style}
        renderItem={(item) => {
          return itemWrapper(
            <Flex
              gap={gap}
              style={{ width: '100%', ...itemStyle }}
            >
              <div
                style={{
                  margin: 0,
                  padding: 0,
                  flexBasis: keyWidth,
                  flexShrink: 0,
                  flexGrow: 0,
                  textAlign: 'right',
                }}
              >
                {keyRenderer1(item.key)}
              </div>
              <div
                style={{
                  margin: 0,
                  padding: 0,
                  flex: '1',
                  width: 0, // for ellipsis to work
                }}
              >
                {valueRenderer1(item.value)}
              </div>
            </Flex>
          );
        }}
      />
    </div>
  );
}
