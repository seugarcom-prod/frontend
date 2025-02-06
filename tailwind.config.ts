import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
		container: {
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				inter: ['inter'],
			},
			colors: {
				light: {
					background: {
						default: '#FFFFFF',
						foreground: '#0A0A0A'
					},
					card: {
						default: '#FFFFFF',
						foreground: '#0A0A0A'
					},
					popover: {
						default: '#FFFFFF',
						foreground: '#0A0A0A'
					},
					primary: {
						default: '#171717',
						foreground: '#FAFAFA'
					},
					secondary: {
						default: '#F5F5F5',
						foreground: '#171717'
					},
					muted: {
						default: '#F5F5F5',
						foreground: '#737373'
					},
					accent: {
						default: '#F5F5F5',
						foreground: '#171717'
					},
					destructive: {
						default: '#EF4444',
						foreground: '#FAFAFA'
					},
					border: '#E5E5E5',
					input: '#E5E5E5',
					ring: '#0A0A0A',
					success: '#22C55E',
					info: '#3B82F6',
					warning: '#EAB308'
				},
				dark: {
					background: {
						default: '#0A0A0A',
						foreground: '#FFFFFF'
					},
					card: {
						default: '#0A0A0A',
						foreground: '#FFFFFF'
					},
					popover: {
						default: '#0A0A0A',
						foreground: '#FFFFFF'
					},
					primary: {
						default: '#FAFAFA',
						foreground: '#171717'
					},
					secondary: {
						default: '#262626',
						foreground: '#FAFAFA'
					},
					muted: {
						default: '#262626',
						foreground: '#A3A3A3'
					},
					accent: {
						default: '#262626',
						foreground: '#FAFAFA'
					},
					destructive: {
						default: '#7F1D1D',
						foreground: '#FAFAFA'
					},
					border: '#262626',
					input: '#262626',
					ring: '#D4D4D4',
					success: '#15803D',
					info: '#1E40AF',
					warning: '#EAB308'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			radius: {
				lg: '10px',
				md: '8px',
				sm: '6px'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
