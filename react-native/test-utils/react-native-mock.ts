/**
 * Minimal `react-native` stand-in for vitest. RN's real source uses Flow syntax
 * which esbuild can't parse, so we alias the import in vitest.config.ts and
 * substitute string-typed host components that react-test-renderer treats as
 * native elements.
 */

export const StyleSheet = {
  create: <T extends Record<string, unknown>>(styles: T): T => styles,
  flatten: (style: unknown) => style,
  hairlineWidth: 1,
  absoluteFill: {},
  absoluteFillObject: {},
  compose: (a: unknown, b: unknown) => [a, b],
};

export const View = 'View' as unknown as React.ComponentType<any>;
export const Text = 'Text' as unknown as React.ComponentType<any>;
export const TouchableOpacity = 'TouchableOpacity' as unknown as React.ComponentType<any>;
export const TouchableHighlight = 'TouchableHighlight' as unknown as React.ComponentType<any>;
export const TouchableWithoutFeedback = 'TouchableWithoutFeedback' as unknown as React.ComponentType<any>;
export const Pressable = 'Pressable' as unknown as React.ComponentType<any>;
export const TextInput = 'TextInput' as unknown as React.ComponentType<any>;
export const ScrollView = 'ScrollView' as unknown as React.ComponentType<any>;
export const FlatList = 'FlatList' as unknown as React.ComponentType<any>;
export const SectionList = 'SectionList' as unknown as React.ComponentType<any>;
export const Switch = 'Switch' as unknown as React.ComponentType<any>;
export const Image = 'Image' as unknown as React.ComponentType<any>;
export const ActivityIndicator = 'ActivityIndicator' as unknown as React.ComponentType<any>;
export const Modal = 'Modal' as unknown as React.ComponentType<any>;
export const SafeAreaView = 'SafeAreaView' as unknown as React.ComponentType<any>;
export const KeyboardAvoidingView = 'KeyboardAvoidingView' as unknown as React.ComponentType<any>;
export const RefreshControl = 'RefreshControl' as unknown as React.ComponentType<any>;
export const StatusBar = 'StatusBar' as unknown as React.ComponentType<any>;
export const Button = 'Button' as unknown as React.ComponentType<any>;

export const Platform = {
  OS: 'ios' as 'ios' | 'android' | 'web',
  select: <T,>(opts: { ios?: T; android?: T; web?: T; default?: T }) =>
    opts.ios ?? opts.default,
  Version: 0,
};

export const Dimensions = {
  get: () => ({ width: 375, height: 812, scale: 2, fontScale: 1 }),
  addEventListener: () => ({ remove: () => {} }),
};

export const Appearance = {
  getColorScheme: () => 'light' as const,
  addChangeListener: () => ({ remove: () => {} }),
};

export const useColorScheme = () => 'light' as 'light' | 'dark' | null;

export const Animated = {
  View: 'Animated.View' as unknown as React.ComponentType<any>,
  Text: 'Animated.Text' as unknown as React.ComponentType<any>,
  ScrollView: 'Animated.ScrollView' as unknown as React.ComponentType<any>,
  Image: 'Animated.Image' as unknown as React.ComponentType<any>,
  createAnimatedComponent: <T,>(c: T): T => c,
  Value: class {
    constructor(public _value: number = 0) {}
    setValue(v: number) {
      this._value = v;
    }
    interpolate() {
      return this;
    }
  },
  timing: () => ({ start: (cb?: () => void) => cb?.() }),
  spring: () => ({ start: (cb?: () => void) => cb?.() }),
  parallel: () => ({ start: (cb?: () => void) => cb?.() }),
  sequence: () => ({ start: (cb?: () => void) => cb?.() }),
};

export const Linking = {
  openURL: async () => {},
  canOpenURL: async () => false,
  addEventListener: () => ({ remove: () => {} }),
};

export const Alert = {
  alert: () => {},
};

export const PixelRatio = {
  get: () => 2,
  getFontScale: () => 1,
  roundToNearestPixel: (n: number) => Math.round(n),
};

export type ViewStyle = unknown;
export type TextStyle = unknown;
export type ImageStyle = unknown;
export type StyleProp<T> = T;
export type OpaqueColorValue = string;
