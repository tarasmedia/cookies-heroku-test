const express = require('express');

const router = express.Router();

const sha256 = require('sha256');

const { User } = require('../db/models');
const { checkUser, deepCheckUser } = require('../middleware/allMiddleware');

router.get('/signup', (req, res) => {
  res.render('signupPage');
});

router.post('/signup', async (req, res) => {
  const { name, email } = req.body;
  const password = sha256(req.body.password); // шифруем пароль
  const user = await User.create({ name, email, password }); // создаем нового юзера
  req.session.userName = user.name; // записываем в сессию имя юзера, чтобы потмо его проверять (см стр 12 в allMiddleware.js)
  req.session.userEmail = user.email;
  req.session.userId = user.id;
  res.redirect(`/users/profile/${user.id}`); // редирект на профиль нового юзера
});

router.get('/signin', (req, res) => {
  res.render('loginPage');
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } }); // ищем в бд юзера по почте
  if (user) {
    if (user.password === sha256(req.body.password)) { // если шифрованный пароль из бд совпадает с зашифрованным тем что ввел юзер
      req.session.userName = user.name; // записываем в сессию имя юзера, чтобы потмо его проверять (см стр 12 в allMiddleware.js)
      req.session.userEmail = user.email;
      req.session.userId = user.id;
      res.redirect(`/users/profile/${user.id}`);
    } else {
      res.send(`wrong pasword, valid is ${user.password}`);
    }
  } else {
    res.redirect('/users/signup');
  }
});

router.get('/profile/:id', checkUser, deepCheckUser, async (req, res) => { // проходим мидлверы и попадаем в профиль
  const user = await User.findByPk(req.params.id);
  res.render('userPage', { user });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
