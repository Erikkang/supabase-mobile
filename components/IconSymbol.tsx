import { Ionicons } from '@expo/vector-icons';
import { StyleProp, TextStyle } from 'react-native';

type IconSymbolProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>; // use TextStyle, not ViewStyle
};

export function IconSymbol({
  name,
  size = 28,
  color = '#2563EB',
  style,
}: IconSymbolProps) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}
