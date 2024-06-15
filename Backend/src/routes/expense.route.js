import { Router } from "express";
import { verifyJWT } from "../middlwares/auth.middleware.js";
import {
  addExpense,
  deleteExpense,
  updateExpense,
} from "../controllers/expense.controller.js";

const router = Router();

// Apply JWT verification middleware to all the routes
router.use(verifyJWT);

router.route("/add-expense").post(addExpense);
router.route("/update-expense/:expenseId").post(updateExpense);
router.route("/delete-expense/:expenseId").delete(deleteExpense);

export default router;