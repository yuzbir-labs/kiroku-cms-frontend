import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    // Colors
    colorPrimary: '#667eea',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#667eea',
    colorTextBase: '#171717',
    colorBgBase: '#ffffff',

    // Typography
    fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,

    // Border
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,

    // Shadow
    boxShadow:
      '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  components: {
    Button: {
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      fontWeight: 500,
      primaryShadow: 'none',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      borderRadius: 8,
    },
    Input: {
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      borderRadius: 8,
      paddingBlock: 8,
      paddingInline: 12,
    },
    Select: {
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      borderRadius: 8,
    },
    Table: {
      borderRadius: 12,
      headerBg: '#fafafa',
      headerColor: '#171717',
      headerSplitColor: 'transparent',
      rowHoverBg: '#f9fafb',
      borderColor: '#e5e7eb',
      padding: 16,
      paddingSM: 12,
    },
    Card: {
      borderRadius: 12,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    Checkbox: {
      borderRadius: 4,
      controlInteractiveSize: 18,
    },
    Radio: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Drawer: {
      borderRadius: 0,
    },
    Modal: {
      borderRadius: 12,
    },
  },
};
