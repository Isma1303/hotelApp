import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'

type ThemeName = 'light'

type ThemeTokens = Record<string, string>

type ThemeMap = Record<ThemeName, ThemeTokens>

type ThemeContextValue = {
  theme: ThemeName
  tokens: ThemeTokens
}

const themes: ThemeMap = {
  light: {
    '--color-primary': '#3b82f6',
    '--color-primary-dark': '#2563eb',
    '--color-primary-light': '#60a5fa',

    '--bg-primary': '#f6f8fc',
    '--bg-secondary': '#ffffff',
    '--bg-tertiary': '#eef2f8',
    '--bg-hover': '#e8eef7',

    '--text-primary': '#0f172a',
    '--text-secondary': '#1f2937',
    '--text-muted': '#64748b',
    '--text-disabled': '#94a3b8',

    '--border-primary': '#e2e8f0',
    '--border-secondary': '#e7eef7',
    '--border-light': 'rgba(15, 23, 42, 0.06)',

    '--color-success': '#16a34a',
    '--color-success-bg': 'rgba(22, 163, 74, 0.1)',
    '--color-success-light': 'rgba(22, 163, 74, 0.16)',

    '--color-warning': '#f59e0b',
    '--color-warning-bg': 'rgba(245, 158, 11, 0.1)',
    '--color-warning-light': 'rgba(245, 158, 11, 0.18)',

    '--color-danger': '#ef4444',
    '--color-danger-bg': 'rgba(239, 68, 68, 0.1)',
    '--color-danger-light': 'rgba(239, 68, 68, 0.16)',

    '--color-info': '#3b82f6',
    '--color-info-bg': 'rgba(59, 130, 246, 0.1)',
    '--color-info-light': 'rgba(59, 130, 246, 0.16)',

    '--shadow-sm': '0 2px 8px rgba(15, 23, 42, 0.06)',
    '--shadow-md': '0 6px 16px rgba(15, 23, 42, 0.08)',
    '--shadow-lg': '0 10px 24px rgba(15, 23, 42, 0.12)',
    '--shadow-xl': '0 16px 32px rgba(15, 23, 42, 0.14)',

    '--radius-sm': '0.375rem',
    '--radius-md': '0.5rem',
    '--radius-lg': '0.75rem',
    '--radius-xl': '1rem',
    '--radius-full': '9999px',

    '--spacing-xs': '0.25rem',
    '--spacing-sm': '0.5rem',
    '--spacing-md': '1rem',
    '--spacing-lg': '1.5rem',
    '--spacing-xl': '2rem',

    '--transition-fast': '0.15s ease',
    '--transition-normal': '0.2s ease',
    '--transition-slow': '0.3s ease',

    '--font-size-xs': '0.75rem',
    '--font-size-sm': '0.875rem',
    '--font-size-base': '1rem',
    '--font-size-lg': '1.125rem',
    '--font-size-xl': '1.25rem',
    '--font-size-2xl': '1.5rem',
    '--font-size-3xl': '2rem'
  }
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'light', tokens: themes.light })

type ThemeProviderProps = {
  theme?: ThemeName
  children: ReactNode
}

/**
 * Injects theme tokens as CSS variables on :root so components can reuse them without duplicating CSS.
 */
export function ThemeProvider({ theme = 'light', children }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement
    const selected = themes[theme]

    Object.entries(selected).forEach(([variable, value]) => {
      root.style.setProperty(variable, value)
    })

    return () => {
      Object.keys(selected).forEach((variable) => {
        root.style.removeProperty(variable)
      })
    }
  }, [theme])

  const value = useMemo<ThemeContextValue>(() => ({ theme, tokens: themes[theme] }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

export const themeTokens = themes
