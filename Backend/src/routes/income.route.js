import { Router } from "express";
import { verifyJWT } from "../middlwares/auth.middleware.js";
import {
  addIncome,
  deleteIncome,
  getIncome,
  updateIncome,
} from "../controllers/income.controller.js";

const router = Router();

// Apply JWT verification middleware to all the routes
router.use(verifyJWT);

router.route("/add-income").post(addIncome);
router.route("/getIncome/:incomeId").post(getIncome);
router.route("/update-income/:incomeId").post(updateIncome);
router.route("/delete-income/:incomeId").delete(deleteIncome);

export default router;
