"use strict";
const express = require("express");
const authController = require("../controllers/authenticationController");
let authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/resetPasswordRequest", authController.resetPasswordRequest);
authRouter.post("/resetPassword/:token", authController.resetPassword);
authRouter.post("/resendVerification", authController.resendVerificationEmail);
authRouter.get("/verifyEmail/:token", authController.verifyEmail);

module.exports = authRouter;
