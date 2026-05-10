/**
 * CommonJS `react-native` stub. Native Node `require('react-native')` calls
 * (made by @testing-library/react-native) get redirected here via setup.ts so
 * vitest never has to parse RN's Flow-typed source. Keep in sync with
 * react-native-mock.ts (the ESM/TS version used by app code under vitest).
 */

const StyleSheet = {
  create: (s) => s,
  flatten: (s) => s,
  hairlineWidth: 1,
  absoluteFill: {},
  absoluteFillObject: {},
  compose: (a, b) => [a, b],
};

const noop = () => {};

const Platform = {
  OS: 'ios',
  select: (opts) => (opts.ios !== undefined ? opts.ios : opts.default),
  Version: 0,
};

const Animated = {
  View: 'Animated.View',
  Text: 'Animated.Text',
  ScrollView: 'Animated.ScrollView',
  Image: 'Animated.Image',
  createAnimatedComponent: (c) => c,
  Value: class {
    constructor(v = 0) {
      this._value = v;
    }
    setValue(v) {
      this._value = v;
    }
    interpolate() {
      return this;
    }
  },
  timing: () => ({ start: (cb) => cb && cb() }),
  spring: () => ({ start: (cb) => cb && cb() }),
  parallel: () => ({ start: (cb) => cb && cb() }),
  sequence: () => ({ start: (cb) => cb && cb() }),
};

module.exports = {
  StyleSheet,
  Platform,
  Animated,
  Dimensions: {
    get: () => ({ width: 375, height: 812, scale: 2, fontScale: 1 }),
    addEventListener: () => ({ remove: noop }),
  },
  Appearance: {
    getColorScheme: () => 'light',
    addChangeListener: () => ({ remove: noop }),
  },
  Linking: {
    openURL: async () => {},
    canOpenURL: async () => false,
    addEventListener: () => ({ remove: noop }),
  },
  Alert: { alert: noop },
  PixelRatio: { get: () => 2, getFontScale: () => 1, roundToNearestPixel: Math.round },
  useColorScheme: () => 'light',
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  TouchableHighlight: 'TouchableHighlight',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
  Pressable: 'Pressable',
  TextInput: 'TextInput',
  ScrollView: 'ScrollView',
  FlatList: 'FlatList',
  SectionList: 'SectionList',
  Switch: 'Switch',
  Image: 'Image',
  ActivityIndicator: 'ActivityIndicator',
  Modal: 'Modal',
  SafeAreaView: 'SafeAreaView',
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  RefreshControl: 'RefreshControl',
  StatusBar: 'StatusBar',
  Button: 'Button',
};
