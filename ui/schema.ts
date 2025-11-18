import type { ChatRequest, ChatResponse } from 'ollama';

export interface Invoke {
  id: string;
  order: number;
  at: string;
  method: string;
  path: string;
  status: number;
  request_header: Record<string, string>;
  request_body: any;
  response_header: Record<string, string>;
  response_body: any;
}

export function getInvokeRequestAs<T>(invoke: Invoke): T {
  return invoke.request_body as T;
}

export function getInvokeResponseAs<T>(invoke: Invoke): T {
  return invoke.response_body as T;
}

export function getInvokeRequestAsChatRequest(invoke: Invoke): ChatRequest {
  return getInvokeRequestAs<ChatRequest>(invoke);
}

export function getInvokeResponseAsChatResponse(invoke: Invoke): ChatResponse {
  return getInvokeResponseAs<ChatResponse>(invoke);
}
