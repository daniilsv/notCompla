export default () => ({
  server: {
    port: 3000,
  },
  database: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5441,
    username: 'notCompla',
    password: 'notCompla',
    database: 'notCompla',
    logging: true,
    synchronize: true,
  },
  jwt: {
    expiresIn: 3600,
    secret: 'ssssssssssssssssss',
  },
  sendpulse: {
    id: '111111',
    secret: '22222222',
    from: {
      name: 'notCompla',
      email: 'bot@some.ru',
    },
  },
});
