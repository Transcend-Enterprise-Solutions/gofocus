declare module 'react-native-wheel-picker' {
    import React from 'react';
    import { ViewStyle } from 'react-native';
  
    interface WheelPickerProps {
      data: string[];
      selectedValue: string | number;
      onValueChange: (value: string | number) => void;
      style?: ViewStyle;
      isCyclic?: boolean;
      selectedItemTextColor?: string;
      selectedItemTextSize?: number;
      unselectedItemTextColor?: string;
      unselectedItemTextSize?: number;
    }
  
    export default class WheelPicker extends React.Component<WheelPickerProps> {}
  }
  