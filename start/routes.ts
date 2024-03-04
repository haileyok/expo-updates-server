/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import DeploysController from '#controllers/deploys_controller'
const ManifestsController = () => import('#controllers/manifests_controller')

router.get('/manifest', [ManifestsController, 'index'])
router.post('/deploy', [DeploysController, 'index'])
