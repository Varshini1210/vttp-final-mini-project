module.exports = {
    resolve: {
      fallback: {
        global: require.resolve('global') // Polyfill for 'global'
      }
    }
  };
  