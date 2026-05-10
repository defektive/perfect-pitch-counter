// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type MaterialIconName =
  | 'home'
  | 'send'
  | 'code'
  | 'chevron-right'
  | 'sports-baseball'
  | 'dashboard'
  | 'format-list-bulleted'
  | 'settings'
  | 'check'
  | 'radio-button-unchecked'
  | 'star'
  | 'delete'
  | 'keyboard-arrow-up'
  | 'keyboard-arrow-down'
  | 'lightbulb'
  | 'lightbulb-outline'
  | 'schedule';

type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: Record<string, MaterialIconName> = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'baseball': 'sports-baseball',
  'dashboard': 'dashboard',
  'list': 'format-list-bulleted',
  'list.bullet': 'format-list-bulleted',
  'gear': 'settings',
  'checkmark': 'check',
  'circle': 'radio-button-unchecked',
  'star': 'star',
  'trash': 'delete',
  'arrow.up': 'keyboard-arrow-up',
  'arrow.down': 'keyboard-arrow-down',
  'bolt': 'lightbulb',
  'clock': 'schedule',
  'bolt.stroke': 'lightbulb-outline',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
