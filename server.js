const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const { parse } = require('path');

const app = new Koa();

const port = process.env.PORT || 7070;
// eslint-disable-next-line no-unused-vars
const server = http.createServer(app.callback()).listen(port);

// eslint-disable-next-line consistent-return
app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    // eslint-disable-next-line no-return-await
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*' };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({ ...headers, 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH' });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
    }
    ctx.response.status = 204;
  }
});

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

const tickets = [
  {
    id: 1,
    name: 'Установить обновление КВ-ХХХ',
    description: 'Вышло критическое обновление для Windows, нужно поставить обновления в следующем приоритете: 1. Сервера 2. Рабочие станции',
    status: false,
    created: 1636445942,
  },
  {
    id: 2,
    name: 'Переустановить Windows, ПК-Hall24',
    description: 'Переустановить Windows, ПК-Hall24',
    status: false,
    created: 1636352342,
  },
];

app.use(async (ctx) => {
  // eslint-disable-next-line no-undef
  if (ctx.request.method === 'GET') ({ method } = ctx.request.query);
  // eslint-disable-next-line no-undef
  if (ctx.request.method === 'POST') ({ method } = ctx.request.body);

  // eslint-disable-next-line no-undef
  switch (method) {
    case 'allTickets':
      // eslint-disable-next-line max-len
      ctx.response.body = tickets.map((item) => ({
        id: item.id, name: item.name, status: item.status, created: item.created,
      }));
      return;
    case 'ticketById':
      ctx.response.body = tickets.find((item) => item.id === ctx.request.query.id);
      return;
    case 'createTicket':
      tickets.push({
        id: tickets.length + 1,
        name: parse.ctx.request.body.name,
        description: parse.ctx.request.body.description,
        status: false,
        created: new Date().getTime(),
      });
      return;
    default:
      ctx.response.status = 404;
  }
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server is listening on ${port} ...`));
