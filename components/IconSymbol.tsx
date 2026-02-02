import { Ionicons } from '@expo/vector-icons';
import { StyleProp, TextStyle } from 'react-native';

type IconSymbolProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function IconSymbol({
  name,
  size = 20,
  color = '#111827',
  style,
}: IconSymbolProps) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
}
