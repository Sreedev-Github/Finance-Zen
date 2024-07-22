import { Router } from "express";
import { verifyJWT } from "../middlwares/auth.middleware.js";
import {
  addSaving,
  deleteSaving,
  getAllSavingInOrder,
  getSaving,
  updateSaving,
} from "../controllers/saving.controller.js";

const router = Router();

// Apply JWT verification middleware to all the routes
router.use(verifyJWT);

router.route("/add-saving").post(addSaving);
router.route("/getSaving/:savingId").post(getSaving);
router.route("/update-saving/:savingId").post(updateSaving);
router.route("/delete-saving/:savingId").delete(deleteSaving);
router.route("/get-saving/:count").post(getAllSavingInOrder);

export default router;
