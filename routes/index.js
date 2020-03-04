// const passport = require('passport');
const authRouter = require('./auth');
const monitorRouter = require('./monitor');
const userRouter = require('./user');
const lowBalance = require('./lowbalance');
const system = require('./system');
const maingrid = require('./maingrid');
const maingrid_popup = require('./maingrid_popup');

module.exports = function(app) {
  app.use('/api/auth', authRouter);
  app.use('/api/monitor', monitorRouter);
  app.use('/api/user', userRouter);
  app.use('/api/lowbalance', lowBalance);
  app.use('/api/system', system);
  app.use('/api/maingrid', maingrid);
  app.use('/api/maingrid/popup', maingrid_popup);
  // TODO -- use this middleware for authentication
  // passport.authenticate('jwt', { session: false })
};
