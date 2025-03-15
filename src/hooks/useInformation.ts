import { useState } from 'react';

export interface InformationState {
  selectedItem: string;
  items: string[];
}

export function useInformation() {
  const [state, setState] = useState<InformationState>({
    selectedItem: 'System Info',
    items: ['System Info', 'Grid Info', 'Input Info', 'Output Info']
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