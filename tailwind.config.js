module.exports = (isProd) => ({
  prefix: '',
  purge: {
    enabled: isProd,
    content: [
      '**/*.html',
      '**/*.ts',
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    /*colors: theme => ({
      ...theme('colors'),
      'primary': 'teal',
    })*/
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
});
