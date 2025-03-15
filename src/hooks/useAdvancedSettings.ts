import { useState } from 'react';

export interface AdvancedSettingsState {
  selectedItem: string;
  items: string[];
  exportLimit: number;
  passwordStep: number;
  isPasswordEntered: boolean;
  gridMode: 'ON' | 'OFF';
  modeSelect: string;
  exportPowerSet: number;
  softBackflowPower: number;
}

export function useAdvancedSettings() {
  const [state, setState] = useState<AdvancedSettingsState>({
    selectedItem: 'Enter Password',
    items: ['Enter Password', 'Grid Mode', 'Mode Select', 'Export Power Set', 'Soft Hard Lmt Set'],
    exportLimit: 2.5,
    passwordStep: 0,
    isPasswordEntered: false,
    gridMode: 'ON',
    modeSelect: 'Standard',
    exportPowerSet: 0,
    softBackflowPower: 0
  });

  const handleUp = () => {
    if (!state.isPasswordEntered) {
      // Password entry (0010)
      setState(prev => ({
        ...prev,
        passwordStep: Math.min(3, prev.passwordStep + 1)
      }));

      // Check if password is correct (UP once after two DOWNs)
      if (state.passwordStep === 2) {
        setState(prev => ({
          ...prev,
          isPasswordEntered: true,
          selectedItem: 'Grid Mode'
        }));
      }
      return;
    }

    // Handle different menu items
    switch (state.selectedItem) {
      case 'Grid Mode':
        setState(prev => ({
          ...prev,
          gridMode: prev.gridMode === 'ON' ? 'OFF' : 'ON'
        }));
        break;
      case 'Export Power Set':
        setState(prev => ({
          ...prev,
          exportPowerSet: Math.min(10, prev.exportPowerSet + 0.1)
        }));
        break;
      case 'Soft Hard Lmt Set':
        setState(prev => ({
          ...prev,
          softBackflowPower: Math.min(10, prev.softBackflowPower + 0.1)
        }));
        break;
      default:
        // Navigate menu items
        const currentIndex = state.items.indexOf(state.selectedItem);
        const nextIndex = (currentIndex - 1 + state.items.length) % state.items.length;
        setState(prev => ({
          ...prev,
          selectedItem: state.items[nextIndex]
        }));
    }
  };

  const handleDown = () => {
    if (!state.isPasswordEntered) {
      // Password entry (0010)
      setState(prev => ({
        ...prev,
        passwordStep: Math.max(0, prev.passwordStep - 1)
      }));
      return;
    }

    // Handle different menu items
    switch (state.selectedItem) {
      case 'Grid Mode':
        setState(prev => ({
          ...prev,
          gridMode: prev.gridMode === 'ON' ? 'OFF' : 'ON'
        }));
        break;
      case 'Export Power Set':
        setState(prev => ({
          ...prev,
          exportPowerSet: Math.max(0, prev.exportPowerSet - 0.1)
        }));
        break;
      case 'Soft Hard Lmt Set':
        setState(prev => ({
          ...prev,
          softBackflowPower: Math.max(0, prev.softBackflowPower - 0.1)
        }));
        break;
      default:
        // Navigate menu items
        const currentIndex = state.items.indexOf(state.selectedItem);
        const nextIndex = (currentIndex + 1) % state.items.length;
        setState(prev => ({
          ...prev,
          selectedItem: state.items[nextIndex]
        }));
    }
  };

  const adjustExportLimit = (increment: boolean) => {
    setState(prev => ({
      ...prev,
      exportLimit: Math.max(0, prev.exportLimit + (increment ? 0.1 : -0.1))
    }));
  };

  const getValue = () => {
    if (!state.isPasswordEntered) {
      return `Password: ${state.passwordStep === 2 ? '001' : '0'.repeat(state.passwordStep)}`;
    }

    switch (state.selectedItem) {
      case 'Grid Mode':
        return `Grid: ${state.gridMode}`;
      case 'Mode Select':
        return state.modeSelect;
      case 'Export Power Set':
        return `${state.exportPowerSet.toFixed(1)}KW`;
      case 'Soft Hard Lmt Set':
        return `${state.softBackflowPower.toFixed(1)}KW`;
      default:
        return state.selectedItem;
    }
  };

  return {
    state,
    handleUp,
    handleDown,
    adjustExportLimit,
    getValue
  };
}