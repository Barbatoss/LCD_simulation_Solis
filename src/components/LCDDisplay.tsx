import React, { useState, useEffect } from 'react';
import { useInformation } from '../hooks/useInformation';
import { useSettings } from '../hooks/useSettings';
import { useAdvancedInfo } from '../hooks/useAdvancedInfo';
import { useAdvancedSettings } from '../hooks/useAdvancedSettings';
import logo from '../logo.png';

type MenuType = 'START' | 'STATUS' | 'MAIN' | 'INFORMATION' | 'SETTINGS' | 'ADVANCED_INFO' | 'ADVANCED_SETTINGS' | 'EXPORT_LIMIT';
const mainMenuOptions: MenuType[] = ['INFORMATION', 'SETTINGS', 'ADVANCED_INFO', 'ADVANCED_SETTINGS'];

export default function LCDDisplay() {
  const [selectedMainOption, setSelectedMainOption] = useState<MenuType>('INFORMATION');
  const [previousMenu, setPreviousMenu] = useState<MenuType>('MAIN');
  const [activeButton, setActiveButton] = useState<string | null>(null);
  
  const [lcdState, setLcdState] = useState<{
    currentMenu: MenuType;
    power: number;
    currentDateTime: string;
    statusMessage: string;
    powerLED: boolean;
    operationLED: boolean;
    alarmLED: boolean;
    autoScroll: boolean;
  }>({
    currentMenu: 'START',
    power: 2.5,
    currentDateTime: new Date().toLocaleString(),
    statusMessage: 'Generating',
    powerLED: true,
    operationLED: true,
    alarmLED: false,
    autoScroll: true
  });

  const information = useInformation();
  const settings = useSettings();
  const advancedInfo = useAdvancedInfo();
  const advancedSettings = useAdvancedSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setLcdState(prev => ({
        ...prev,
        currentDateTime: new Date().toLocaleString()
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (lcdState.autoScroll && (lcdState.currentMenu === 'START' || lcdState.currentMenu === 'STATUS')) {
      const scrollTimer = setInterval(() => {
        setLcdState(prev => ({
          ...prev,
          currentMenu: prev.currentMenu === 'START' ? 'STATUS' : 'START'
        }));
      }, 10000);

      return () => clearInterval(scrollTimer);
    }
  }, [lcdState.autoScroll, lcdState.currentMenu]);

  useEffect(() => {
    if (lcdState.currentMenu === 'START') {
      const startTimer = setTimeout(() => {
        setLcdState(prev => ({
          ...prev,
          currentMenu: 'STATUS'
        }));
      }, 5000);

      return () => clearTimeout(startTimer);
    }
  }, [lcdState.currentMenu]);

  // Update operation LED based on grid mode
  useEffect(() => {
    setLcdState(prev => ({
      ...prev,
      operationLED: advancedSettings.state.gridMode === 'ON'
    }));
  }, [advancedSettings.state.gridMode]);

  // Update status message when export limit is set
  useEffect(() => {
    if (advancedSettings.state.exportLimit > 1) {
      setLcdState(prev => ({
        ...prev,
        statusMessage: 'Generating'
      }));
    }
  }, [advancedSettings.state.exportLimit]);

  const handleButtonPress = (button: string, action: () => void) => {
    setActiveButton(button);
    action();
    setTimeout(() => setActiveButton(null), 100);
  };

  const handleUp = () => {
    handleButtonPress('up', () => {
      switch (lcdState.currentMenu) {
        case 'MAIN':
          setSelectedMainOption(prev => {
            const currentIndex = mainMenuOptions.indexOf(prev);
            return currentIndex > 0 ? mainMenuOptions[currentIndex - 1] : prev;
          });
          break;
        case 'START':
        case 'STATUS':
          setLcdState(prev => ({
            ...prev,
            currentMenu: prev.currentMenu === 'START' ? 'STATUS' : 'START',
            autoScroll: false
          }));
          break;
        case 'INFORMATION':
          information.handleUp();
          break;
        case 'SETTINGS':
          settings.handleUp();
          break;
        case 'ADVANCED_INFO':
          advancedInfo.handleUp();
          break;
        case 'ADVANCED_SETTINGS':
          advancedSettings.handleUp();
          break;
      }
    });
  };

  const handleDown = () => {
    handleButtonPress('down', () => {
      switch (lcdState.currentMenu) {
        case 'MAIN':
          setSelectedMainOption(prev => {
            const currentIndex = mainMenuOptions.indexOf(prev);
            return currentIndex < mainMenuOptions.length - 1 ? mainMenuOptions[currentIndex + 1] : prev;
          });
          break;
        case 'START':
        case 'STATUS':
          setLcdState(prev => ({
            ...prev,
            currentMenu: prev.currentMenu === 'START' ? 'STATUS' : 'START',
            autoScroll: false
          }));
          break;
        case 'INFORMATION':
          information.handleDown();
          break;
        case 'SETTINGS':
          settings.handleDown();
          break;
        case 'ADVANCED_INFO':
          advancedInfo.handleDown();
          break;
        case 'ADVANCED_SETTINGS':
          advancedSettings.handleDown();
          break;
      }
    });
  };

  const handleEnter = () => {
    handleButtonPress('enter', () => {
      if (lcdState.currentMenu === 'START' || lcdState.currentMenu === 'STATUS') {
        setPreviousMenu(lcdState.currentMenu);
        setLcdState(prev => ({
          ...prev,
          currentMenu: 'MAIN',
          autoScroll: false
        }));
      } else if (lcdState.currentMenu === 'MAIN') {
        setPreviousMenu('MAIN');
        setLcdState(prev => ({
          ...prev,
          currentMenu: selectedMainOption
        }));
      } else if (lcdState.currentMenu === 'ADVANCED_SETTINGS') {
        advancedSettings.handleEnter();
      }
    });
  };

  const handleEsc = () => {
    handleButtonPress('esc', () => {
      if (lcdState.currentMenu === 'MAIN') {
        setLcdState(prev => ({
          ...prev,
          currentMenu: previousMenu,
          autoScroll: true
        }));
      } else if (lcdState.currentMenu === 'ADVANCED_SETTINGS') {
        if (!advancedSettings.state.isPasswordEntered) {
          setLcdState(prev => ({
            ...prev,
            currentMenu: 'STATUS'
          }));
        }
        advancedSettings.handleEsc();
      } else if (lcdState.currentMenu !== 'START' && lcdState.currentMenu !== 'STATUS') {
        setLcdState(prev => ({
          ...prev,
          currentMenu: 'MAIN'
        }));
      }
    });
  };

  const getDisplayContent = () => {
    switch (lcdState.currentMenu) {
      case 'START':
        return {
          title: 'Power',
          value: `${lcdState.power}KW`,
          subtitle: lcdState.currentDateTime
        };
      case 'STATUS':
        return {
          title: 'Status',
          value: lcdState.statusMessage,
          subtitle: lcdState.currentDateTime
        };
      case 'MAIN':
        return {
          title: 'Main Menu',
          value: selectedMainOption,
          subtitle: 'Press UP/DOWN to navigate'
        };
      case 'INFORMATION':
        return {
          title: 'Information',
          value: information.state.selectedItem,
          subtitle: 'Press UP/DOWN to navigate'
        };
      case 'SETTINGS':
        return {
          title: 'Settings',
          value: settings.state.selectedItem,
          subtitle: 'Press UP/DOWN to navigate'
        };
      case 'ADVANCED_INFO':
        return {
          title: 'Advanced Info',
          value: advancedInfo.state.selectedItem,
          subtitle: 'Press UP/DOWN to navigate'
        };
      case 'ADVANCED_SETTINGS':
        return {
          title: 'Advanced Settings',
          value: advancedSettings.getValue(),
          subtitle: advancedSettings.state.isPasswordEntered ? 'Press UP/DOWN to navigate' : 'Enter Password'
        };
      default:
        return {
          title: '',
          value: '',
          subtitle: ''
        };
    }
  };

  const display = getDisplayContent();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="flex items-center gap-2 mb-1">
        <img alt='logo' src={String(logo)} />
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between mb-6 px-4">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${lcdState.powerLED ? 'bg-red-500' : 'bg-gray-600'}`}></div>
              <span className="text-white text-xs">POWER</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${lcdState.operationLED ? 'bg-green-500' : 'bg-gray-600'}`}></div>
              <span className="text-white text-xs">OPERATION</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${lcdState.alarmLED ? 'bg-yellow-500' : 'bg-gray-600'}`}></div>
              <span className="text-white text-xs">ALARM</span>
            </div>
          </div>

          <div className="bg-[#a8d1a0] border-4 border-gray-700 p-6 h-48 rounded-sm font-mono text-black">
            <div className="flex flex-col h-full">
              <div className="text-2xl mb-2">{display.title}</div>
              <div className="text-3xl font-bold mb-4">{display.value}</div>
              <div className="text-lg mt-auto">{display.subtitle}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8 px-4">
          <button
            onClick={handleEsc}
            className={`rounded-full w-16 h-16 flex items-center justify-center text-sm font-medium transition-all duration-100 ${
              activeButton === 'esc' 
                ? 'bg-gray-400 transform scale-95' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ESC
          </button>
          <button
            onClick={handleUp}
            className={`rounded-full w-16 h-16 flex items-center justify-center text-sm font-medium transition-all duration-100 ${
              activeButton === 'up' 
                ? 'bg-gray-400 transform scale-95' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            UP
          </button>
          <button
            onClick={handleDown}
            className={`rounded-full w-16 h-16 flex items-center justify-center text-sm font-medium transition-all duration-100 ${
              activeButton === 'down' 
                ? 'bg-gray-400 transform scale-95' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            DOWN
          </button>
          <button
            onClick={handleEnter}
            className={`rounded-full w-16 h-16 flex items-center justify-center text-sm font-medium transition-all duration-100 ${
              activeButton === 'enter' 
                ? 'bg-gray-400 transform scale-95' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ENTER
          </button>
        </div>

        <div className="mt-8 text-right pr-4">
          <span className="text-orange-500 font-semibold">4G Series</span>
        </div>
      </div>
    </div>
  );
}