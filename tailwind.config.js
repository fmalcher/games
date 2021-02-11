module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      '**/*.html',
      '**/*.ts',
    ]
  },
  darkMode: false,
  theme: {
    extend: {}
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
};
