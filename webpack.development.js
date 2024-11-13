const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const fs = require('fs');

let useLocalCert = false;

try {
  fs.accessSync('local.teams.office.com-key.pem', fs.constants.F_OK);
  fs.accessSync('local.teams.office.com.pem', fs.constants.F_OK);
  useLocalCert = true;
} catch (err) {
  console.log(err);
  console.log('Certificates not found, using default https settings...');
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
    host: 'local.teams.office.com',
    port: 4000,
    server: useLocalCert
      ? {type: 'https',
        options: {
          key: fs.readFileSync('local.teams.office.com-key.pem'),
          cert: fs.readFileSync('local.teams.office.com.pem'),
        }
      }
      : 'https'
  },
  stats: {
    errorDetails: true,
  },
});