import { Router } from "express";
import {registerUser,loginUser, refreshAccessToken, logoutUser, getCurrentUser, getUserFinancialData, addProfile, getTransactionsForLastNDays, getSpecificTransactionsForLastNTransactions, getAllTransactionsInOrder, getAllTransactionInPages } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlwares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(verifyJWT, refreshAccessToken);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/finance-data").post(verifyJWT,getUserFinancialData);
router.route("/add-profile").post(verifyJWT, addProfile)
router.route("/transactions/:days").post(verifyJWT, getTransactionsForLastNDays);
router.route("/transactions/:count/:type").post(verifyJWT, getSpecificTransactionsForLastNTransactions);
router.route("/all-transactions/:count").post(verifyJWT, getAllTransactionsInOrder);
router.route("/get-paged-transactions").post(verifyJWT, getAllTransactionInPages);

export default router;