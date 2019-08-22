module.exports = {
  apps : [{
    name: 'eCommerceApi',
    script: 'dist/main.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: "max",
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    exec_mode: "cluster",
    env: {
      NODE_ENV: 'DEV'
    },
    env_production: {
      NODE_ENV: 'PROD'
    }
  }]
};
