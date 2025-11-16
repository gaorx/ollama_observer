import { Invoke } from './schema';

export function startPullInvokeId(callback: (id: string) => void) {
  const s = new EventSource('/api/observer/pull');
  s.onmessage = (event) => {
    const o = JSON.parse(event.data);
    callback(o['id'] || '');
  };
}

export async function getAllInvokes(): Promise<Invoke[]> {
  return await call('/api/observer/all', {});
}

export async function getAllInvokeIds(): Promise<string[]> {
  return await call('/api/observer/ids', {});
}

export async function getInvokeByID(id: string): Promise<Invoke> {
  return await call('/api/observer/get', { id: id });
}

async function call(path: string, args: Record<string, any>): Promise<any> {
  const resp = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  if (resp.status !== 200) {
    throw new Error(`API call failed with status ${resp.status}`);
  }
  const root = await resp.json();
  if (root['code'] !== 0) {
    throw new Error(`API call failed with code ${root['code']}: ${root['error']}`);
  }
  return root['data'] || null;
}
