
const router = require('koa-router')();

const startPageRoute = require('./main');
router.get('/', startPageRoute.get);

const imageUploadRoute = require('./upload');
router.post('/', imageUploadRoute.post);

module.exports = router;