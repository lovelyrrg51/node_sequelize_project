const config = {
  // email: {
  //   domain: 'xxx.com',
  //   mailgun: {
  //     public: process.env.MAILGUN_PUBLIC,
  //     private: process.env.MAILGUN_PRIVATE
  //   },
  //   from: {
  //     support: 'hello@xxx.com',
  //   },
  //   template: {
  //     folder: 'default',
  //   }
  // },
  original_server: 'server.sim-anywhere.com',
  original_port: 443,
  email: {
    domain: 'multi.com',
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY
    },
    from: {
      support: 'support@multi.com',
    },
    template: {
      folder: 'default',
    }
  },
  app: {
    secret: 'adsadadasdfwewe23f4fsfa3r2ra',
    port: 3808,
  },
  db: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    dialect: 'mysql',
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // define: {
    //   timestamps: false
    // },
    logging: true,
    sync: true
  },
  useroperations: {
    NONE: -1,
    LOGGED_IN: 0,
    LOGGED_OUT: 1,
    SIMCARD_EDITED: 2,
    SIMCARD_ACTIVATED: 3,
    SIMCARD_SUSPENDED: 4,
    SIMCARD_CONNECTION_RESET: 5,
    OPERATOR_ADDED_TO_BLACKLIST: 6,
    OPERATOR_BLACKLIST_EDITED: 7,
    OPERATOR_REMOVED_FROM_BLACKLIST: 8,
    ORGANISATION_ADDED: 9,
    ORGANISATION_EDITED: 10,
    ORGANISATION_DELETED: 11,
    USER_ADDED: 12,
    USER_EDITED: 13,
    USER_DELETED: 14,
    ADMIN_ADDED: 15,
    ADMIN_EDITED: 16,
    ADMIN_DELETED: 17,
    ORGANISATION_LOCKED: 18,
    ORGANISATION_UNLOCKED: 19,
    SIMCARD_BATCH_ADDED: 20,
    ORDER_ADDED: 21,
    ORDER_EDITED: 22,
    ORDER_DELETED: 23,
    ORDER_FULFILLED: 24,
    ORDER_CANCELLED: 25,
    BILL_INSERTED_ON_ERP: 26,
    WALLET_DEPOSIT: 27,
    WALLET_WITHDRAW: 28
  },
  eventtype:{
    NONE: -1,
    GENERIC: 0,
    UPDATE_LOCATION: 1,
    UPDATE_GPRS_LOCATION: 2,
    CREATE_PDP_CONTEXT: 3,
    UPDATE_PDP_CONTEXT: 4,
    DELETE_PDP_CONTEXT: 5,
    USER_AUTHENTICATION_FAILED: 6,
    APPLICATION_AUTHENTICATION_FAILED: 7,
    SIM_ACTIVATION: 8,
    SIM_SUSPENSION: 9,
    SIM_DELETION: 10,
    ENDPOINT_BLOCKED: 11,
    ORGANISATION_BLOCKED: 12,
    SUPPORT_ACCESS: 13,
    MULTI_FACTOR_AUTHENTICATION: 14,
    PURGE_LOCATION: 15,
    PURGE_GPRS_LOCATION: 16,
    SELF_SIGNUP: 17,
    THRESHOLD_REACHED: 18,
    QUOTA_USED_UP: 19
  },
  cost_type: {
    MONTHLY_FEE_COST_TYPE: 0,
    EXTRA_MB_COST_TYPE: 1
  },
  trsanction_type: {
    DEPOSIT: 0,
    WITHDRAW: 1
  },
  project: 'Sim-Anywhere',
  frontendBaseUrl: process.env.FRONTEND_BASE_URL,
  RESET_PASSWORD_EXPIRATION: 15, // minutes
  DIAMOND_ACCOUNT_INDEX: 0,
  GOLD_ACCOUNT_INDEX: 1,
  SIM_Status:{
    ACTIVATED: 0,
    DELETED: 1,
    ISSUED: 2,
    SUSPENDED: 3
  }
};

module.exports = config;
