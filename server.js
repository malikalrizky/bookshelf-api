const Hapi = require('hapi');
const routes = require('./routes');
const cors = require('hapi-cors');

const server = Hapi.server({
  port: 8000,
  host: 'localhost',
});

server.route(routes);

async function start() {
  try {
    await server.register({
      plugin: cors,
      options: {
        origins: ['*'],
      },
    });
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
}

start();
