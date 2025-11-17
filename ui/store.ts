import { create } from 'zustand';
import { Message } from 'ollama';
import { Invoke, getInvokeRequestAsChatRequest, getInvokeResponseAsChatResponse } from './schema';
import { getAllInvokes, getInvokeByID, startPullInvokeId, clearInvokes } from './api';

interface InvokeState {
  activitedId: string;
  invokes: Invoke[];
  searchKeyword: string;
  matchingInvokes: Invoke[];
  fetchAll(): Promise<void>;
  fetchOne(id: string): Promise<void>;
  clear(): Promise<void>;
  startPull(): void;
  setSearchKeyword(keyword: string): void;
  activate(id: string): void;
  activatePrevious(): void;
  activateNext(): void;
}

export const useInvokeStore = create<InvokeState>()((set) => ({
  activitedId: '',
  invokes: [],
  searchKeyword: '',
  matchingInvokes: [],

  async fetchAll(): Promise<void> {
    const invokes = await getAllInvokes();
    set((state) => {
      return {
        invokes: invokes,
        matchingInvokes: filterByKeyword(invokes, state.searchKeyword),
      };
    });
  },
  async fetchOne(id: string): Promise<void> {
    const invoke = await getInvokeByID(id);
    set((state) => {
      const exists = state.invokes.find((invoke) => invoke.id === id);
      if (exists != null) {
        return state;
      } else {
        return {
          invokes: [...state.invokes, invoke],
          matchingInvokes: filterByKeyword([...state.invokes, invoke], state.searchKeyword),
        };
      }
    });
  },
  async clear(): Promise<void> {
    await clearInvokes();
    await this.fetchAll();
  },
  startPull(): void {
    startPullInvokeId((id: string) => {
      if (id != null && id !== '') {
        (async () => {
          this.fetchOne(id);
        })();
      }
    });
  },
  setSearchKeyword(keyword: string): void {
    const matching = filterByKeyword(this.invokes, keyword);
    set({ searchKeyword: keyword, matchingInvokes: matching });
  },
  activate(id: string): void {
    set({ activitedId: id });
  },
  activatePrevious(): void {
    set((state) => {
      const l = state.matchingInvokes;
      const index = l.findIndex((invoke) => invoke.id === state.activitedId);
      if (index > 0) {
        return { activitedId: l[index - 1].id };
      } else {
        return state;
      }
    });
  },
  activateNext(): void {
    set((state) => {
      const l = state.matchingInvokes;
      const index = l.findIndex((invoke) => invoke.id === state.activitedId);
      if (index >= 0 && index < l.length - 1) {
        return { activitedId: l[index + 1].id };
      } else {
        return state;
      }
    });
  },
}));

function isMatch(invoke: Invoke, keyword: string): boolean {
  if (invoke.id === keyword) {
    return true;
  } else if (invoke.path.includes(keyword)) {
    return true;
  } else {
    if (invoke.path === '/api/chat') {
      const isMatchMessage = (msg?: Message): boolean => {
        return msg != null && msg.content != null && msg.content.includes(keyword);
      };
      const isMatchMessages = (msgs: Message[]): boolean => {
        for (const msg of msgs) {
          if (isMatchMessage(msg)) {
            return true;
          }
        }
        return false;
      };
      const chatRequest = getInvokeRequestAsChatRequest(invoke);
      const chatResponse = getInvokeResponseAsChatResponse(invoke);
      return isMatchMessages(chatRequest.messages || []) || isMatchMessage(chatResponse.message);
    }
  }
  return false;
}

function filterByKeyword(invokes: Invoke[], keyword: string): Invoke[] {
  if (keyword == null || keyword === '') {
    return [...invokes];
  } else {
    return invokes.filter((invoke) => isMatch(invoke, keyword));
  }
}
