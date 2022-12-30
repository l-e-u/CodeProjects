import { Router } from 'express';
const router = Router();

// GET user by username
router.get('/', function (req, res, next) {
  res.send('respond with a users\' resource custom message!');
});

// POST a new user
router.post('/', function (req, res, next) {
  return (
    res.send(
      req.context.models.User.create({
        username: req.body.username,
        password: req.body.password
      })
    )
  );
});

export default router;
