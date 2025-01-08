const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const fs = require('fs');

const keyPath = process.env.SSL_KEY_FILE;
const certPath = process.env.SSL_CERT_FILE;
const useLocalCert = keyPath && certPath && fs.existsSync(keyPath) && fs.existsSync(certPath);
if (useLocalCert) {
  console.log('Using SSL with the following files:');
  console.log('SSL_KEY_FILE:', keyPath);
  console.log('SSL_CERT_FILE:', certPath);
}

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    client: {
      logging: 'info',
      overlay: true,
    },
    compress: true,
    open: true,
    static: './build',
    port: 4000,
    server: useLocalCert
      ? {type: 'https',
        options: {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        }
      }
      : 'https'
  },
  stats: {
    errorDetails: true,
  },
});