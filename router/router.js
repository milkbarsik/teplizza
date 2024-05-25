const Router = require('express');
const router = new Router();
const controller = require('../controller/controller');

router.get('/home', controller.getSections.bind(controller));
router.get('/section/:id', controller.getSection.bind(controller));
router.get('/plant/:sectionNum/:id', controller.getLogs.bind(controller));
router.put('/section/:sectionNum', controller.updateEnvironment.bind(controller));

module.exports = router;
