import { useState } from 'react';

export interface AdvancedInfoState {
  selectedItem: string;
  items: string[];
}

export function useAdvancedInfo() {
  const [state, setState] = useState<AdvancedInfoState>({
    selectedItem: 'Error History',
    items: ['Error History', 'Warning History', 'System Parameters', 'Energy Records']
  });

  const handleUp = () => {
    const currentIndex = state.items.indexOf(state.selectedItem);
    const nextIndex = (currentIndex - 1 + state.items.length) % state.items.length;
    setState(prev => ({
      ...prev,
      selectedItem: state.items[nextIndex]
    }));
  };

  const handleDown = () => {
    const currentIndex = state.items.indexOf(state.selectedItem);
    const nextIndex = (currentIndex + 1) % state.items.length;
    setState(prev => ({
      ...prev,
      selectedItem: state.items[nextIndex]
    }));
  };

  return {
    state,
    handleUp,
    handleDown
  };
}