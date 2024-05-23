const Router = require('express')
const router = new Router()
const controller = require('../controller/controller')

router.get('/home', controller.getSections)
router.get('/section/:id', controller.getSection)
router.get('/plant/:sectionNum/:id', controller.getLogs)
router.put('/section/:sectionNum', controller.updateEnvironment)
router.put('/teplizza', controller.saveLogs);
module.exports = router;