export type ThemeDefinition = {
  name: string
  value: string
  category: 'default' | 'dev' | 'professional'
  description: string
}

export const themes: ThemeDefinition[] = [
  // Default
  { name: 'Light', value: 'light', category: 'default', description: 'Clean light theme' },
  { name: 'Dark', value: 'dark', category: 'default', description: 'Classic dark theme' },
  { name: 'System', value: 'system', category: 'default', description: 'Match system preference' },
  // Developer
  { name: 'Catppuccin', value: 'catppuccin', category: 'dev', description: 'Warm pastel dark theme' },
  { name: 'Gruvbox', value: 'gruvbox', category: 'dev', description: 'Retro amber dark theme' },
  { name: 'One Dark', value: 'one-dark', category: 'dev', description: 'Atom One Dark theme' },
  { name: 'Rosé Pine', value: 'rose-pine', category: 'dev', description: 'Soft purple dark theme' },
  // Professional
  { name: 'Corporate', value: 'corporate', category: 'professional', description: 'Clean corporate blue' },
  { name: 'Slate', value: 'slate', category: 'professional', description: 'Neutral slate tones' },
  { name: 'Ocean', value: 'ocean', category: 'professional', description: 'Deep ocean blues' },
]

export const themeCategories = {
  default: themes.filter((t) => t.category === 'default'),
  dev: themes.filter((t) => t.category === 'dev'),
  professional: themes.filter((t) => t.category === 'professional'),
}
