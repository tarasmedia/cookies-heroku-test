require('dotenv').config();
const express = require('express');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const { welcomeUser } = require('./middleware/allMiddleware');

const app = express();

// view engine setup
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET, // строка для шифрования сессии
  resave: false, // не пересохраняем сессию если не было изменений
  saveUninitialized: false, // не сохраняем сессию если она пустая
  cookie: { secure: true }, // не HTTPS
  name: 'Albert', // имя сессионной куки
  // store: new FileStore(), // хранилище для куков - папка с файлами
}));

app.use(welcomeUser);

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(process.env.PORT ?? 3005);
