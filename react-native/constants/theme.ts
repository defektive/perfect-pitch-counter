/**
 * Theme colors matching the Flutter app visual design
 */

export const Colors = {
  // Background colors matching Flutter app
  background: {
    primary: '#1E1E1E',        // Main dark background
    secondary: '#2C2C2C',      // Secondary dark areas
    card: '#1a1a1a',           // Card backgrounds
    elevated: '#2D2D2D',       // Elevated surfaces
  },

  // Text colors
  text: {
    primary: '#FFFFFF',        // Main text
    secondary: '#888888',      // Secondary text
    tertiary: '#666666',       // Tertiary text (labels, subtitles)
    muted: '#444444',          // Muted/muted content
  },

  // Accent colors
  accent: {
    primary: '#1976D2',        // Blue accent (Flutter blue style)
    primaryLight: '#e3f2fd',   // Light blue backgrounds
    success: '#4CAF50',        // Green for success states
    warning: '#FF9800',        // Orange for warnings
    error: '#F44336',          // Red for errors
  },

  // Divider colors
  divider: {
    light: '#333333',
    dark: '#444444',
  },

  // Border colors
  border: {
    light: '#333333',
    dark: '#333333',
  },

  // Button colors
  button: {
    primary: '#1976D2',        // Main action button
    primaryText: '#FFFFFF',
    secondary: '#444444',      // Secondary action
    secondaryText: '#FFFFFF',
    ghost: '#1976D2',          // Ghost button accent
  },

  // Icon colors
  icon: {
    default: '#9BA1A6',
    selected: '#FFFFFF',
    accent: '#1976D2',
    error: '#F44336',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  // Base font sizes
  h1: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  large: {
    fontSize: 48,
    fontWeight: 'bold' as const,
  },
};
