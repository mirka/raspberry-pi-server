## Daemonize with [pm2](https://github.com/Unitech/pm2)
```
$ pm2 start app.js
```

## Generate and configure pm2 boot on startup
```
$ pm2 startup systemd -u pi
```
(Related: [PM2 Raspberry Jessie - Not spawning on boot · Issue #1654 · Unitech/pm2](https://github.com/Unitech/pm2/issues/1654 "PM2 Raspberry Jessie - Not spawning on boot · Issue #1654 · Unitech/pm2"))