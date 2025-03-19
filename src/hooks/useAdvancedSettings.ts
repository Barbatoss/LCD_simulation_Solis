import { useState } from 'react';

export interface AdvancedSettingsState {
  selectedItem: string;
  items: string[];
  exportLimit: number;
  passwordDigits: number[];
  currentDigitIndex: number;
  isPasswordEntered: boolean;
  gridMode: 'ON' | 'OFF';
  modeSelect: string;
  exportPowerSet: number;
  softBackflowPower: number;
  currentMenu: 'MAIN' | 'GRID' | 'EPM' | 'MODE_SELECT' | 'METER_SELECT' | 'EXPORT_LIMIT';
  meterType: '1phase' | '3phase';
  selectedMeter: string;
  meterOptions: {
    '1phase': string[];
    '3phase': string[];
  };
}

export function useAdvancedSettings() {
  const [state, setState] = useState<AdvancedSettingsState>({
    selectedItem: 'Enter Password',
    items: ['Grid ON/OFF', 'Internal EPM Set'],
    exportLimit: 2.5,
    passwordDigits: [0, 0, 0, 0],
    currentDigitIndex: 0,
    isPasswordEntered: false,
    gridMode: 'ON',
    modeSelect: 'Standard',
    exportPowerSet: 0,
    softBackflowPower: 0,
    currentMenu: 'MAIN',
    meterType: '1phase',
    selectedMeter: '',
    meterOptions: {
      '1phase': ['ACR10R16DTE', 'SDM120CTM'],
      '3phase': ['ACR10R-D16TE4', 'DTSD1352', 'SDM630MCT']
    }
  });

  const handleEnterPassword = (digits: number[]) => {
    if (digits[0] === 0 && digits[1] === 0 && digits[2] === 1 && digits[3] === 0) {
      setState(prev => ({
        ...prev,
        isPasswordEntered: true,
        currentMenu: 'MAIN',
        selectedItem: 'Grid ON/OFF'
      }));
      return true;
    }
    return false;
  };

  const handleUp = () => {
    if (!state.isPasswordEntered) {
      setState(prev => {
        const newDigits = [...prev.passwordDigits];
        newDigits[prev.currentDigitIndex] = 1;
        const newIndex = prev.currentDigitIndex + 1;
        return {
          ...prev,
          passwordDigits: newDigits,
          currentDigitIndex: Math.min(3, newIndex)
        };
      });
      return;
    }

    switch (state.currentMenu) {
      case 'MAIN':
        setState(prev => ({
          ...prev,
          selectedItem: prev.selectedItem === 'Grid ON/OFF' ? 'Internal EPM Set' : 'Grid ON/OFF'
        }));
        break;
      case 'GRID':
        setState(prev => ({
          ...prev,
          gridMode: prev.gridMode === 'ON' ? 'OFF' : 'ON'
        }));
        break;
      case 'EPM':
        setState(prev => ({
          ...prev,
          selectedItem: prev.selectedItem === 'Mode Select' ? 'Soft Hard Lmt Set' : 'Mode Select'
        }));
        break;
      case 'MODE_SELECT':
        setState(prev => ({
          ...prev,
          modeSelect: 'Meter'
        }));
        break;
      case 'METER_SELECT':
        setState(prev => ({
          ...prev,
          meterType: prev.meterType === '1phase' ? '3phase' : '1phase'
        }));
        break;
      case 'EXPORT_LIMIT':
        setState(prev => ({
          ...prev,
          exportLimit: Math.min(10, prev.exportLimit + 0.1)
        }));
        break;
    }
  };

  const handleDown = () => {
    if (!state.isPasswordEntered) {
      setState(prev => {
        const newDigits = [...prev.passwordDigits];
        newDigits[prev.currentDigitIndex] = 0;
        const newIndex = prev.currentDigitIndex + 1;
        return {
          ...prev,
          passwordDigits: newDigits,
          currentDigitIndex: Math.min(3, newIndex)
        };
      });
      return;
    }

    switch (state.currentMenu) {
      case 'MAIN':
        setState(prev => ({
          ...prev,
          selectedItem: prev.selectedItem === 'Grid ON/OFF' ? 'Internal EPM Set' : 'Grid ON/OFF'
        }));
        break;
      case 'GRID':
        setState(prev => ({
          ...prev,
          gridMode: prev.gridMode === 'ON' ? 'OFF' : 'ON'
        }));
        break;
      case 'EPM':
        setState(prev => ({
          ...prev,
          selectedItem: prev.selectedItem === 'Mode Select' ? 'Soft Hard Lmt Set' : 'Mode Select'
        }));
        break;
      case 'MODE_SELECT':
        setState(prev => ({
          ...prev,
          modeSelect: 'Standard'
        }));
        break;
      case 'METER_SELECT':
        setState(prev => ({
          ...prev,
          meterType: prev.meterType === '1phase' ? '3phase' : '1phase'
        }));
        break;
      case 'EXPORT_LIMIT':
        setState(prev => ({
          ...prev,
          exportLimit: Math.max(0, prev.exportLimit - 0.1)
        }));
        break;
    }
  };

  const handleEnter = () => {
    if (!state.isPasswordEntered) {
      const success = handleEnterPassword(state.passwordDigits);
      if (!success) {
        setState(prev => ({
          ...prev,
          passwordDigits: [0, 0, 0, 0],
          currentDigitIndex: 0
        }));
      }
      return;
    }

    switch (state.currentMenu) {
      case 'MAIN':
        if (state.selectedItem === 'Grid ON/OFF') {
          setState(prev => ({
            ...prev,
            currentMenu: 'GRID'
          }));
        } else {
          setState(prev => ({
            ...prev,
            currentMenu: 'EPM',
            selectedItem: 'Mode Select'
          }));
        }
        break;
      case 'EPM':
        if (state.selectedItem === 'Mode Select') {
          setState(prev => ({
            ...prev,
            currentMenu: 'MODE_SELECT'
          }));
        } else {
          setState(prev => ({
            ...prev,
            currentMenu: 'EXPORT_LIMIT'
          }));
        }
        break;
    }
  };

  const getValue = () => {
    if (!state.isPasswordEntered) {
      const digits = state.passwordDigits.map((digit, index) => 
        index === state.currentDigitIndex ? `[${digit}]` : digit
      ).join('');
      return `Password: ${digits}`;
    }

    switch (state.currentMenu) {
      case 'MAIN':
        return state.selectedItem;
      case 'GRID':
        return `Grid: ${state.gridMode}`;
      case 'EPM':
        return state.selectedItem;
      case 'MODE_SELECT':
        return `Mode: ${state.modeSelect}`;
      case 'METER_SELECT':
        return `Meter Type: ${state.meterType}`;
      case 'EXPORT_LIMIT':
        return `${state.exportLimit.toFixed(1)}KW`;
      default:
        return state.selectedItem;
    }
  };

  const resetPassword = () => {
    setState(prev => ({
      ...prev,
      passwordDigits: [0, 0, 0, 0],
      currentDigitIndex: 0,
      isPasswordEntered: false,
      selectedItem: 'Enter Password',
      currentMenu: 'MAIN'
    }));
  };

  return {
    state,
    handleUp,
    handleDown,
    handleEnter,
    getValue,
    resetPassword
  };
}