/**
 * Theme colors matching the Flutter app visual design
 * Supports both light and dark modes
 */

export const Colors = {
  // Dark mode colors (matching Flutter app)
  dark: {
    // Background colors
    primary: '#1E1E1E',        // Main dark background
    secondary: '#2C2C2C',      // Secondary dark areas
    card: '#1a1a1a',           // Card backgrounds
    elevated: '#2D2D2D',       // Elevated surfaces
    background: '#000000',     // App background
    divider: '#333333',        // Divider for dark mode
    border: '#333333',         // Border for dark mode
    accent: {
      primary: '#1976D2',        // Blue accent (Flutter blue style)
      primaryLight: '#e3f2fd',   // Light blue backgrounds
      success: '#4CAF50',        // Green for success states
      warning: '#FF9800',        // Orange for warnings
      error: '#F44336',          // Red for errors
    },
    text: {
      primary: '#FFFFFF',        // Main text (dark mode)
      primaryLight: '#111111',   // Main text (light mode)
      secondary: '#888888',      // Secondary text
      tertiary: '#666666',       // Tertiary text (labels, subtitles)
      muted: '#444444',          // Muted/muted content
    },
    button: {
      primary: '#1976D2',        // Main action button
      primaryText: '#FFFFFF',
      secondary: '#444444',      // Secondary action
      secondaryText: '#FFFFFF',
      ghost: '#1976D2',          // Ghost button accent
    },
    icon: {
      default: '#9BA1A6',
      selected: '#FFFFFF',
      accent: '#1976D2',
      error: '#F44336',
    },
  },

  // Light mode colors
  light: {
    // Background colors
    primary: '#FFFFFF',        // Main light background
    secondary: '#F5F5F5',      // Secondary light areas
    card: '#F0F0F0',           // Card backgrounds
    elevated: '#FAFAFA',       // Elevated surfaces
    background: '#F5F5F5',     // App background
    divider: '#E0E0E0',        // Divider for light mode
    border: '#E0E0E0',         // Border for light mode
    accent: {
      primary: '#1976D2',        // Blue accent (Flutter blue style)
      primaryLight: '#e3f2fd',   // Light blue backgrounds
      success: '#4CAF50',        // Green for success states
      warning: '#FF9800',        // Orange for warnings
      error: '#F44336',          // Red for errors
    },
    text: {
      primary: '#FFFFFF',        // Main text (dark mode)
      primaryLight: '#111111',   // Main text (light mode)
      secondary: '#888888',      // Secondary text
      tertiary: '#666666',       // Tertiary text (labels, subtitles)
      muted: '#444444',          // Muted/muted content
    },
    button: {
      primary: '#1976D2',        // Main action button
      primaryText: '#FFFFFF',
      secondary: '#444444',      // Secondary action
      secondaryText: '#FFFFFF',
      ghost: '#1976D2',          // Ghost button accent
    },
    icon: {
      default: '#9BA1A6',
      selected: '#FFFFFF',
      accent: '#1976D2',
      error: '#F44336',
    },
  },

  // Text colors (used for both modes with context)
  text: {
    primary: '#FFFFFF',        // Main text (dark mode)
    primaryLight: '#111111',   // Main text (light mode)
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
