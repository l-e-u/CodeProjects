import { Router } from 'express';
const router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express Custom' });
  console.log('URL: ', req.url);
  console.log('Path: ', req.path);
  res.sendFile(req.path);
});

export default router;
