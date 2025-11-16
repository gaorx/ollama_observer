import { create } from 'zustand';
import { Invoke } from './schema';
import { getAllInvokes, getInvokeByID, startPullInvokeId } from './api';

interface InvokeState {
  invokes: Invoke[];
  activitedId: string;
  fetchAll(): Promise<void>;
  fetchOne(id: string): Promise<void>;
  startPull(): void;
  activate(id: string): void;
  activatePrevious(): void;
  activateNext(): void;
}

export const useInvokeStore = create<InvokeState>()((set) => ({
  invokes: [],
  activitedId: '',
  async fetchAll(): Promise<void> {
    const invokes = await getAllInvokes();
    set({ invokes: invokes });
  },
  async fetchOne(id: string): Promise<void> {
    const invoke = await getInvokeByID(id);
    set((state) => {
      const exists = state.invokes.find((invoke) => invoke.id === id);
      if (exists != null) {
        return state;
      } else {
        return { invokes: [...state.invokes, invoke] };
      }
    });
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
  activate(id: string): void {
    set({ activitedId: id });
  },
  activatePrevious(): void {
    set((state) => {
      const index = state.invokes.findIndex((invoke) => invoke.id === state.activitedId);
      if (index > 0) {
        return { activitedId: state.invokes[index - 1].id };
      } else {
        return state;
      }
    });
  },
  activateNext(): void {
    set((state) => {
      const index = state.invokes.findIndex((invoke) => invoke.id === state.activitedId);
      if (index >= 0 && index < state.invokes.length - 1) {
        return { activitedId: state.invokes[index + 1].id };
      } else {
        return state;
      }
    });
  },
}));
