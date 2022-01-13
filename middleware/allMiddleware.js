const couner = (req, res, next) => {
  if (!req.cookies.counter) { // если куки со счетчиком еще нет, устанавливаем эту куку 
    res.cookie('counter', '1', { maxAge: 1000 * 60 * 60 });
  } else {
    const ct = Number(req.cookies.counter) + 1; // если счетчик уже есть то прибавляем 1 к нему
    res.cookie('counter', ct, { maxAge: 1000 * 60 * 60 });
  }
  next();
};

const checkUser = (req, res, next) => {
  if (req.session.userName) { // проверяем есть ли в сессии userName (см стр 18 и 33 в users.js router)
    next();
  } else {
    res.redirect('/users/signin'); // если в сессии нет userName тогда редирект
  }
};

const deepCheckUser = (req, res, next) => {
  console.log('deepCheckUser');
  console.log(req.params.id, req.session.userId);
  if (Number(req.session.userId) === Number(req.params.id)) { // сравниваем id юзера и id профиля на который он хочет попасть
    next();
  } else {
    res.redirect(`/users/profile/${req.session.userId}`); // редиректим юзера всегда на свой профиль при попытке перейти на чужой
  }
};

const welcomeUser = (req, res, next) => {
  res.locals.userId = req.session?.userId; // записываем в locals данные из сессии чтобы они были доступны в hbs
  if (req.session) {
    res.locals.userName = req.session.userName;
  }
  next();
};

module.exports = {
  couner, checkUser, deepCheckUser, welcomeUser,
};
