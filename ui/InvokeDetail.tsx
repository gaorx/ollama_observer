import { ReactNode } from 'react';
import { useInvokeStore } from './store';

export interface InvokeDetailProps {
  style?: React.CSSProperties;
}

export default function InvokeDetail(props?: InvokeDetailProps): ReactNode {
  const store = useInvokeStore();
  const invoke = store.invokes.find((inv) => inv.id === store.activitedId);
  if (!invoke) {
    return <div>No invoke selected</div>;
  }
  return (
    <div style={props?.style}>
      <h2>Invoke Detail</h2>
      <p>ID: {invoke.id}</p>
    </div>
  );
}
