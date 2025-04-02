import { useState } from 'react';

export interface AdvancedSettingsState {
  selectedItem: string;
  items: string[];
  exportLimit: number;
  passwordDigits: number[];
  currentDigitIndex: number;
  isPasswordEntered: boolean;
  gridMode: 'ON' | 'OFF';
  failsafeMode: 'ON' | 'OFF';
  modeSelect: 'Meter in Grid' | 'Meter in Load';
  exportPowerSet: number;
  softBackflowPower: number;
  currentMenu: 'MAIN' | 'STANDARD' | 'GRID' | 'EPM' | 'MODE_SELECT' | 'METER_SELECT' | 'METER_OPTIONS' | 'EXPORT_LIMIT' | 'FAILSAFE';
  previousMenu: 'MAIN' | 'STANDARD' | 'GRID' | 'EPM' | 'MODE_SELECT' | 'METER_SELECT' | 'METER_OPTIONS' | 'EXPORT_LIMIT' | 'FAILSAFE';
  meterType: '1phase' | '3phase';
  selectedMeter: string;
  meterOptions: {
    '1phase': string[];
    '3phase': string[];
  };
  selectedStandard: string;
  gridStandards: string[];
}

export function useAdvancedSettings() {
  const [state, setState] = useState<AdvancedSettingsState>({
    selectedItem: 'Enter Password',
    items: ['Select Standard', 'Grid ON/OFF', 'Internal EPM Set'],
    exportLimit: 2.5,
    passwordDigits: [0, 0, 0, 0],
    currentDigitIndex: 0,
    isPasswordEntered: false,
    gridMode: 'ON',
    failsafeMode: 'ON',
    modeSelect: 'Meter in Grid',
    exportPowerSet: 0,
    softBackflowPower: 0,
    currentMenu: 'MAIN',
    previousMenu: 'MAIN',
    meterType: '1phase',
    selectedMeter: '',
    meterOptions: {
      '1phase': ['ACR10R16DTE', 'SDM120CTM'],
      '3phase': ['ACR10R-D16TE4', 'DTSD1352', 'SDM630MCT']
    },
    selectedStandard: 'AS4777-02',
    gridStandards: [
      'AS4777-02',
      'AS4777-15',
      'AUS-Q-0.9',
      'AUS-Q-0.8',
      'AS4777_SA',
      'AS4777_NA',
      'AS4777-WA',
      'AS4777-NW',
      'ASNZ4777-A',
      'ASNZ4777-B',
      'ASNZ4777-C',
      'ASNZ4777-N'
    ]
  });

  const handleEnterPassword = (digits: number[]) => {
    if (digits[0] === 0 && digits[1] === 0 && digits[2] === 1 && digits[3] === 0) {
      setState(prev => ({
        ...prev,
        isPasswordEntered: true,
        currentMenu: 'MAIN',
        selectedItem: 'Select Standard'
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
        setState(prev => {
          const currentIndex = prev.items.indexOf(prev.selectedItem);
          const nextIndex = (currentIndex - 1 + prev.items.length) % prev.items.length;
          return {
            ...prev,
            selectedItem: prev.items[nextIndex]
          };
        });
        break;
      case 'STANDARD':
        setState(prev => {
          const currentIndex = prev.gridStandards.indexOf(prev.selectedStandard);
          const nextIndex = (currentIndex - 1 + prev.gridStandards.length) % prev.gridStandards.length;
          return {
            ...prev,
            selectedStandard: prev.gridStandards[nextIndex]
          };
        });
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
          selectedItem: prev.selectedItem === 'Mode Select' ? 'Meter Select' : 
                       prev.selectedItem === 'Meter Select' ? 'Failsafe' :
                       prev.selectedItem === 'Failsafe' ? 'Soft Hard Lmt Set' : 'Mode Select'
        }));
        break;
      case 'FAILSAFE':
        setState(prev => ({
          ...prev,
          failsafeMode: prev.failsafeMode === 'ON' ? 'OFF' : 'ON'
        }));
        break;
      case 'MODE_SELECT':
        setState(prev => ({
          ...prev,
          modeSelect: prev.modeSelect === 'Meter in Grid' ? 'Meter in Load' : 'Meter in Grid'
        }));
        break;
      case 'METER_SELECT':
        setState(prev => ({
          ...prev,
          meterType: prev.meterType === '1phase' ? '3phase' : '1phase',
          selectedMeter: ''
        }));
        break;
      case 'METER_OPTIONS':
        setState(prev => {
          const options = prev.meterOptions[prev.meterType];
          const currentIndex = options.indexOf(prev.selectedMeter);
          const nextIndex = (currentIndex - 1 + options.length) % options.length;
          return {
            ...prev,
            selectedMeter: options[nextIndex]
          };
        });
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
        setState(prev => {
          const currentIndex = prev.items.indexOf(prev.selectedItem);
          const nextIndex = (currentIndex + 1) % prev.items.length;
          return {
            ...prev,
            selectedItem: prev.items[nextIndex]
          };
        });
        break;
      case 'STANDARD':
        setState(prev => {
          const currentIndex = prev.gridStandards.indexOf(prev.selectedStandard);
          const nextIndex = (currentIndex + 1) % prev.gridStandards.length;
          return {
            ...prev,
            selectedStandard: prev.gridStandards[nextIndex]
          };
        });
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
          selectedItem: prev.selectedItem === 'Mode Select' ? 'Meter Select' : 
                       prev.selectedItem === 'Meter Select' ? 'Failsafe' :
                       prev.selectedItem === 'Failsafe' ? 'Soft Hard Lmt Set' : 'Mode Select'
        }));
        break;
      case 'FAILSAFE':
        setState(prev => ({
          ...prev,
          failsafeMode: prev.failsafeMode === 'ON' ? 'OFF' : 'ON'
        }));
        break;
      case 'MODE_SELECT':
        setState(prev => ({
          ...prev,
          modeSelect: prev.modeSelect === 'Meter in Grid' ? 'Meter in Load' : 'Meter in Grid'
        }));
        break;
      case 'METER_SELECT':
        setState(prev => ({
          ...prev,
          meterType: prev.meterType === '1phase' ? '3phase' : '1phase',
          selectedMeter: ''
        }));
        break;
      case 'METER_OPTIONS':
        setState(prev => {
          const options = prev.meterOptions[prev.meterType];
          const currentIndex = options.indexOf(prev.selectedMeter);
          const nextIndex = (currentIndex + 1) % options.length;
          return {
            ...prev,
            selectedMeter: options[nextIndex]
          };
        });
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

    setState(prev => {
      switch (prev.currentMenu) {
        case 'MAIN':
          if (prev.selectedItem === 'Select Standard') {
            return {
              ...prev,
              currentMenu: 'STANDARD',
              previousMenu: 'MAIN'
            };
          } else if (prev.selectedItem === 'Grid ON/OFF') {
            return {
              ...prev,
              currentMenu: 'GRID',
              previousMenu: 'MAIN'
            };
          } else if (prev.selectedItem === 'Internal EPM Set') {
            return {
              ...prev,
              currentMenu: 'EPM',
              previousMenu: 'MAIN',
              selectedItem: 'Mode Select'
            };
          }
          break;
        case 'STANDARD':
          return {
            ...prev,
            currentMenu: 'MAIN',
            selectedItem: 'Select Standard'
          };
        case 'GRID':
          return {
            ...prev,
            currentMenu: 'MAIN',
            selectedItem: 'Grid ON/OFF'
          };
        case 'EPM':
          if (prev.selectedItem === 'Mode Select') {
            return {
              ...prev,
              currentMenu: 'MODE_SELECT',
              previousMenu: 'EPM'
            };
          } else if (prev.selectedItem === 'Soft Hard Lmt Set') {
            return {
              ...prev,
              currentMenu: 'EXPORT_LIMIT',
              previousMenu: 'EPM'
            };
          } else if (prev.selectedItem === 'Meter Select') {
            return {
              ...prev,
              currentMenu: 'METER_SELECT',
              previousMenu: 'EPM',
              selectedMeter: prev.meterOptions[prev.meterType][0]
            };
          } else if (prev.selectedItem === 'Failsafe') {
            return {
              ...prev,
              currentMenu: 'FAILSAFE',
              previousMenu: 'EPM'
            };
          }
          break;
        case 'MODE_SELECT':
          return {
            ...prev,
            currentMenu: 'EPM',
            selectedItem: 'Mode Select'
          };
        case 'METER_SELECT':
          return {
            ...prev,
            currentMenu: 'METER_OPTIONS',
            previousMenu: 'METER_SELECT',
            selectedMeter: prev.meterOptions[prev.meterType][0]
          };
        case 'METER_OPTIONS':
          return {
            ...prev,
            currentMenu: 'EPM',
            selectedItem: 'Meter Select'
          };
        case 'EXPORT_LIMIT':
          return {
            ...prev,
            currentMenu: 'EPM',
            selectedItem: 'Soft Hard Lmt Set'
          };
        case 'FAILSAFE':
          return {
            ...prev,
            currentMenu: 'EPM',
            selectedItem: 'Failsafe'
          };
      }
      return prev;
    });
  };

  const handleEsc = () => {
    setState(prev => {
      if (!prev.isPasswordEntered) {
        return {
          ...prev,
          passwordDigits: [0, 0, 0, 0],
          currentDigitIndex: 0,
          isPasswordEntered: false,
          selectedItem: 'Enter Password'
        };
      }

      switch (prev.currentMenu) {
        case 'STANDARD':
        case 'GRID':
        case 'EPM':
          return {
            ...prev,
            currentMenu: 'MAIN'
          };
        case 'MODE_SELECT':
          return {
            ...prev,
            currentMenu: 'EPM',
            selectedItem: 'Mode Select'
          };
        case 'METER_OPTIONS':
          return {
            ...prev,
            currentMenu: 'METER_SELECT'
          };
        case 'METER_SELECT':
        case 'EXPORT_LIMIT':
        case 'FAILSAFE':
          return {
            ...prev,
            currentMenu: 'EPM',
            selectedItem: 'Mode Select'
          };
        default:
          return {
            ...prev,
            passwordDigits: [0, 0, 0, 0],
            currentDigitIndex: 0,
            isPasswordEntered: false,
            selectedItem: 'Enter Password',
            currentMenu: 'MAIN'
          };
      }
    });
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
      case 'STANDARD':
        return state.selectedStandard;
      case 'GRID':
        return `Grid: ${state.gridMode}`;
      case 'EPM':
        return state.selectedItem;
      case 'MODE_SELECT':
        return `Mode: ${state.modeSelect}`;
      case 'METER_SELECT':
        return `Meter Type: ${state.meterType}`;
      case 'METER_OPTIONS':
        return state.selectedMeter || state.meterOptions[state.meterType][0];
      case 'EXPORT_LIMIT':
        return `${state.exportLimit.toFixed(1)}KW`;
      case 'FAILSAFE':
        return `Failsafe: ${state.failsafeMode}`;
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
    handleEsc,
    getValue,
    resetPassword
  };
}