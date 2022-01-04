const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');

const app = new Koa();

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  text: true,
  json: true,
}));

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

let tickets = [
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
  let method;
  if (ctx.request.method === 'GET' || ctx.request.method === 'DELETE') ({ method } = ctx.request.query);
  if (ctx.request.method === 'POST' || ctx.request.method === 'PUT') ({ method } = ctx.request.body);

  let ticket;

  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets.map((item) => ({
        id: item.id, name: item.name, status: item.status, created: item.created,
      }));
      return;
    case 'ticketById':
      ctx.response.body = tickets.find((item) => item.id === Number(ctx.request.query.id));
      return;
    case 'createTicket':
      tickets.push({
        id: tickets[tickets.length].id + 1,
        name: ctx.request.body.name,
        description: ctx.request.body.description,
        status: false,
        created: new Date().getTime(),
      });
      ctx.response.body = tickets;
      return;
    case 'deleteTicket':
      tickets = tickets.filter((item) => item.id !== Number(ctx.request.query.id));
      ctx.response.body = tickets;
      return;
    case 'editTicket':
      // ticket = tickets.find((item) => item.id === Number(ctx.request.body.id));
      // ticket.name = ctx.request.body.name;
      // ticket.description = ctx.request.body.description;
      ctx.response.body = Number(ctx.request.body.id);
      return;
    default:
      ctx.response.status = 404;
  }
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port, (err) => {
  if (err) {
    console.log('Error occured:', err);
    return;
  }
  console.log(`Server is listening on ${port} port`);
});
