import type { Config } from 'tailwindcss';
// import {
//   createVariableColors,
//   variableColorsPlugin
// } from 'tailwindcss-variable-colors';
// import colors from 'tailwindcss/colors';
import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: ['class', 'html.dark'],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    // colors,
    // 自定义 CSS 变量
    extend: {
      spacing: {
        header: '60px',
        footer: '60px'
      }
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    typography: (theme: any) => ({
      invert: {
        css: {
          '--tw-prose-body': theme('colors.zinc.400'),
          '--tw-prose-headings': theme('colors.zinc.200'),
          '--tw-prose-links': theme('colors.green.400'),
          '--tw-prose-links-hover': theme('colors.green.400'),
          '--tw-prose-underline': theme('colors.green.400 / 0.3'),
          '--tw-prose-underline-hover': theme('colors.green.400'),
          '--tw-prose-bold': theme('colors.zinc.200'),
          '--tw-prose-counters': theme('colors.zinc.200'),
          '--tw-prose-bullets': theme('colors.zinc.200'),
          '--tw-prose-hr': theme('colors.zinc.700 / 0.4'),
          '--tw-prose-quote-borders': theme('colors.yellow.600'),
          '--tw-prose-captions': theme('colors.zinc.500'),
          '--tw-prose-code': theme('colors.zinc.300'),
          '--tw-prose-code-bg': theme('colors.zinc.200 / 0.05'),
          '--tw-prose-pre-code': theme('colors.zinc.100'),
          '--tw-prose-pre-bg': 'rgb(0 0 0 / 0.4)',
          '--tw-prose-pre-border': theme('colors.zinc.200 / 0.1'),
          '--tw-prose-th-borders': theme('colors.zinc.700'),
          '--tw-prose-td-borders': theme('colors.zinc.800')
        }
      },
      DEFAULT: {
        css: {
          // 使用 Tailwind 颜色系统，支持主题切换
          '--tw-prose-body': theme('colors.zinc.600'),
          '--tw-prose-headings': theme('colors.zinc.900'),
          '--tw-prose-links': theme('colors.green.500'),
          '--tw-prose-links-hover': theme('colors.green.600'),
          '--tw-prose-underline': theme('colors.green.500 / 0.2'),
          '--tw-prose-underline-hover': theme('colors.green.500'),
          '--tw-prose-bold': theme('colors.zinc.900'),
          '--tw-prose-counters': theme('colors.zinc.900'),
          '--tw-prose-bullets': theme('colors.zinc.900'),
          '--tw-prose-hr': theme('colors.zinc.100'),
          '--tw-prose-quote-borders': theme('colors.yellow.300'),
          '--tw-prose-captions': theme('colors.zinc.400'),
          '--tw-prose-code': theme('colors.zinc.700'),
          '--tw-prose-code-bg': theme('colors.zinc.300 / 0.2'),
          '--tw-prose-pre-code': theme('colors.zinc.100'),
          '--tw-prose-pre-bg': theme('colors.zinc.900'),
          '--tw-prose-pre-border': theme('colors.zinc.200'),
          '--tw-prose-th-borders': theme('colors.zinc.200'),
          '--tw-prose-td-borders': theme('colors.zinc.100'),

          // Base
          color: 'var(--tw-prose-body)',
          lineHeight: theme('lineHeight.7'),
          '> *': {
            marginTop: theme('spacing.10'),
            marginBottom: theme('spacing.10')
          },
          p: {
            marginTop: theme('spacing.6'),
            marginBottom: theme('spacing.6')
          },

          // Headings
          'h2, h3': {
            color: 'var(--tw-prose-headings)',
            fontWeight: theme('fontWeight.semibold')
          },
          h2: {
            fontSize: theme('fontSize.lg')[0],
            lineHeight: theme('lineHeight.7'),
            marginTop: theme('spacing.16'),
            marginBottom: theme('spacing.4')
          },
          h3: {
            fontSize: theme('fontSize.base')[0],
            lineHeight: theme('lineHeight.7'),
            marginTop: theme('spacing.12'),
            marginBottom: theme('spacing.4')
          },
          ':is(h2, h3) + *': {
            marginTop: 0
          },

          // Inline elements
          a: {
            color: 'var(--tw-prose-links)',
            fontWeight: theme('fontWeight.semibold'),
            textDecoration: 'underline',
            textDecorationColor: 'var(--tw-prose-underline)',
            transitionProperty: 'color, text-decoration-color',
            transitionDuration: theme('transitionDuration.150'),
            transitionTimingFunction: theme('transitionTimingFunction.in-out')
          },
          'a:hover': {
            color: 'var(--tw-prose-links-hover)',
            textDecorationColor: 'var(--tw-prose-underline-hover)'
          },
          strong: {
            color: 'var(--tw-prose-bold)',
            fontWeight: theme('fontWeight.semibold')
          },
          code: {
            display: 'inline-block',
            color: 'var(--tw-prose-code)',
            fontSize: theme('fontSize.sm')[0],
            fontWeight: theme('fontWeight.semibold'),
            backgroundColor: 'var(--tw-prose-code-bg)',
            borderRadius: theme('borderRadius.lg'),
            paddingLeft: theme('spacing.1'),
            paddingRight: theme('spacing.1')
          },
          'a code': {
            color: 'inherit'
          },
          ':is(h2, h3) code': {
            fontWeight: theme('fontWeight.bold')
          },
          'h2 a, h3 a, h4 a, h5 a, h6 a': {
            color: 'var(--color-primary)'
          },

          // Quotes
          blockquote: {
            paddingLeft: theme('spacing.6'),
            borderLeftWidth: theme('borderWidth.2'),
            borderLeftColor: 'var(--tw-prose-quote-borders)',
            fontStyle: 'italic'
          },

          // Figures
          figcaption: {
            color: 'var(--tw-prose-captions)',
            fontSize: theme('fontSize.sm')[0],
            lineHeight: theme('lineHeight.6'),
            marginTop: theme('spacing.3')
          },
          'figcaption > p': {
            margin: 0
          },

          // Lists
          ul: {
            listStyleType: 'disc'
          },
          ol: {
            listStyleType: 'decimal'
          },
          'ul, ol': {
            paddingLeft: theme('spacing.6')
          },
          li: {
            marginTop: theme('spacing.6'),
            marginBottom: theme('spacing.6'),
            paddingLeft: theme('spacing[3.5]')
          },
          'li::marker': {
            fontSize: theme('fontSize.sm')[0],
            fontWeight: theme('fontWeight.semibold')
          },
          'ol > li::marker': {
            color: 'var(--tw-prose-counters)'
          },
          'ul > li::marker': {
            color: 'var(--tw-prose-bullets)'
          },
          'li :is(ol, ul)': {
            marginTop: theme('spacing.4'),
            marginBottom: theme('spacing.4')
          },
          'li :is(li, p)': {
            marginTop: theme('spacing.3'),
            marginBottom: theme('spacing.3')
          },
          'ul.contains-task-list': {
            listStyle: 'none',
            paddingLeft: 0
          },
          'ul.contains-task-list > li > input[type="checkbox"]': {
            width: theme('spacing.5'),
            marginRight: theme('spacing.4'),
            marginLeft: `-${theme('spacing.3')}`
          },

          // Code blocks
          pre: {
            color: 'var(--tw-prose-pre-code)',
            fontSize: theme('fontSize.sm')[0],
            fontWeight: theme('fontWeight.medium'),
            backgroundColor: 'var(--tw-prose-pre-bg)',
            borderRadius: theme('borderRadius.xl'),
            marginTop: theme('spacing.7'),
            marginBottom: theme('spacing.7'),
            padding: theme('spacing.5'),
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            maxHeight: '30.5em',
            overflowX: 'auto',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          },
          'pre code': {
            display: 'inline',
            color: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 0
          },

          // Horizontal rules
          hr: {
            marginTop: theme('spacing.20'),
            marginBottom: theme('spacing.20'),
            borderTopWidth: '1px',
            borderColor: 'var(--tw-prose-hr)',
            '@screen lg': {
              marginLeft: `calc(${theme('spacing.12')} * -1)`,
              marginRight: `calc(${theme('spacing.12')} * -1)`
            }
          },

          // Tables
          table: {
            width: '100%',
            tableLayout: 'auto',
            textAlign: 'left',
            fontSize: theme('fontSize.sm')[0]
          },
          thead: {
            borderBottomWidth: '1px',
            borderBottomColor: 'var(--tw-prose-th-borders)'
          },
          'thead th': {
            color: 'var(--tw-prose-headings)',
            fontWeight: theme('fontWeight.semibold'),
            verticalAlign: 'bottom',
            paddingBottom: theme('spacing.2')
          },
          'thead th:not(:first-child)': {
            paddingLeft: theme('spacing.2')
          },
          'thead th:not(:last-child)': {
            paddingRight: theme('spacing.2')
          },
          'tbody tr': {
            borderBottomWidth: '1px',
            borderBottomColor: 'var(--tw-prose-td-borders)'
          },
          'tbody tr:last-child': {
            borderBottomWidth: 0
          },
          'tbody td': {
            verticalAlign: 'baseline'
          },
          tfoot: {
            borderTopWidth: '1px',
            borderTopColor: 'var(--tw-prose-th-borders)'
          },
          'tfoot td': {
            verticalAlign: 'top'
          },
          ':is(tbody, tfoot) td': {
            paddingTop: theme('spacing.2'),
            paddingBottom: theme('spacing.2')
          },
          ':is(tbody, tfoot) td:not(:first-child)': {
            paddingLeft: theme('spacing.2')
          },
          ':is(tbody, tfoot) td:not(:last-child)': {
            paddingRight: theme('spacing.2')
          },

          // Code wrapper styles
          '.code-wrapper': {
            position: 'relative'
          },
          '.code-wrapper .copy-button': {
            position: 'absolute',
            top: theme('spacing.3'),
            right: theme('spacing.3'),
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            gap: theme('spacing.1'),
            fontSize: theme('fontSize.sm'),
            fontWeight: theme('fontWeight.medium'),
            height: theme('spacing.8'),
            borderRadius: theme('borderRadius.xl'),
            paddingLeft: theme('spacing.3'),
            paddingRight: theme('spacing.3'),
            border: '1px solid transparent',
            backgroundColor: 'rgb(255 255 255 / 0.1)',
            color: 'rgb(0 0 0 / 1)',
            boxShadow: theme('boxShadow.sm'),
            backdropFilter: 'blur(4px)',
            pointerEvents: 'none',
            opacity: 0,
            transition: 'all 200ms',
            '&:hover': {
              backgroundColor: 'rgb(255 255 255 / 0.8)'
            },
            '&:active': {
              transform: 'scale(0.95)'
            }
          },
          '.code-wrapper:hover .copy-button, .code-wrapper:focus-within .copy-button':
            {
              pointerEvents: 'auto',
              opacity: 1
            },
          '.math': {
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            display: 'inline-block',
            maxWidth: '100%',
            overflow: 'auto',
            verticalAlign: 'bottom',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          },

          // Line number styles
          '.line-number::before': {
            marginRight: theme('spacing.5'),
            marginLeft: `calc(${theme('spacing.2')} * -1)`,
            display: 'inline-block',
            width: theme('spacing.4'),
            textAlign: 'right',
            color: theme('colors.zinc.400'),
            content: 'attr(line)'
          },

          // Mermaid diagram styles
          'pre.mermaid': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent'
          },

          // Dark mode Shiki syntax highlighting
          'html.dark .shiki, html.dark .shiki span': {
            color: 'var(--shiki-dark) !important',
            backgroundColor: 'var(--shiki-dark-bg) !important',
            fontStyle: 'var(--shiki-dark-font-style) !important',
            fontWeight: 'var(--shiki-dark-font-weight) !important',
            textDecoration: 'var(--shiki-dark-text-decoration) !important'
          },

          // Inline code styles (excluding pre code)
          ':where(code:not(pre code)):not(:where([class~="not-prose"]))': {
            borderRadius: theme('borderRadius.md'),
            paddingLeft: '7px',
            paddingRight: '7px',
            paddingTop: '1px',
            paddingBottom: '1px',
            fontFamily: theme('fontFamily.mono'),
            fontSize: theme('fontSize.sm'),
            fontWeight: theme('fontWeight.normal')
            // 注释掉的背景色和文字色样式
            // backgroundColor: theme('colors.neutral.900'),
            // color: theme('colors.neutral.50'),
            // '&.dark': {
            //   backgroundColor: theme('colors.neutral.50'),
            //   color: theme('colors.neutral.900')
            // }
          }
        }
      }
    })
  },
  plugins: [
    // variableColorsPlugin(),
    typography(),
    iconsPlugin({
      collections: {
        ...getIconCollections(['mingcute'])
      }
    })
  ]
};

export default config;
