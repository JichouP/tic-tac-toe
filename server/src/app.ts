import express from 'express';
import store from './Store';

const app = express();

app.use(express.json({}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  if ('OPTIONS' === req.method) {
    res.send(200)
  } else {
    next()
  }
});
app.post('/register', (req, res) => {
  const { name, password } = req.body;
  if (typeof name !== 'string' || typeof password !== 'string') {
    return res.sendStatus(400);
  }
  res.send(store.createUser(name, password));
});
app.use((req, res, next) => {
  const name = req.headers['x-user'] as string;
  const password = req.headers['x-password'] as string;
  if (!store.login(name, password)) {
    return res.sendStatus(400);
  }
  req.user = store.getUser(name);
  next();
});

app.get('/room', (_req, res) => {
  res.send(store.getRooms());
});

app.post('/room', (_req, res) => {
  res.send(store.createRoom());
});

app.get('/room/:id', (req, res) => {
  const room = store.getRoom(req.params.id);
  if (!room) return res.sendStatus(400);
  res.send(room);
});

app.delete('/room/:id', (req, res) => {
  store.deleteRoom(req.params.id);
  res.sendStatus(204);
});

app.post('/room/:id/join', (req, res) => {
  res.send(store.joinRoom(req.params.id, req.user.id));
});

app.post('/room/:id/leave', (req, res) => {
  res.send(store.leaveRoom(req.params.id, req.user.id));
});

app.post('/room/:id/table', (req, res) => {
  res.send(store.updateTable(req.params.id, req.body.table));
});

app.listen(3030, () => {
  console.log('listening at 3000');
});
