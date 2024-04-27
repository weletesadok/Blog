const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser);
router.route("/:id").get(usersController.getUser);
router.route("/:id").delete(usersController.deleteUser);
router.route("/activate").patch(usersController.activateUser);
router.route("/deactivate").patch(usersController.deActivateUser);

module.exports = router;
