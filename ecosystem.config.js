// Common configuration for all apps
const commonConfig = {
  script: "dist/main.js",
  autorestart: true,
  max_memory_restart: "300M",
  restart_delay: 5000,
  namespace: "ams",
  kill_timeout: 5000,
  time: true,
  log_date_format: "DD/MM/YYYY HH:mm:ss",
  merge_logs: true,
  env: {
    TZ: "Asia/Kolkata",
  },
  min_uptime: "10s"
};

module.exports = {
  apps: [
    {
      name: "ams",
      ...commonConfig,
      env: {
        ...commonConfig.env,
        PORT: 443,
        clientId: "ams"
      },
      cron_restart: "0 2 * * *"
    }
  ]
};

