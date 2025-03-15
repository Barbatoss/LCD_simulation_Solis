import { useState } from 'react';

export interface SettingsState {
  selectedItem: string;
  items: string[];
}

export function useSettings() {
  const [state, setState] = useState<SettingsState>({
    selectedItem: 'Language',
    items: ['Language', 'Date & Time', 'Display', 'Factory Reset']
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