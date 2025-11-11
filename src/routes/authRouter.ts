import express from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/authController";
import { authenticatedUser } from "../middleware";

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Must be alphanumeric and unique.
 *                 pattern: '^[a-zA-Z0-9]+$'
 *                 example: 'johndoe123'
 *               email:
 *                 type: string
 *                 description: Must be a valid email address and unique.
 *                 format: email
 *                 example: 'john.doe@example.com'
 *               password:
 *                 type: string
 *                 description: Must be at least 8 characters, and contain an uppercase letter, a lowercase letter, a number, and a special character.
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$'
 *                 minLength: 8
 *                 example: 'Password123!'
 *     responses:
 *       201:
 *         description: User registered successfully
 */
authRouter.route("/register").post(register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string, example: 'josue.batey@gmail.com' }
 *               password: { type: string, example: 'password123' }
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
authRouter.route("/login").post(login);

/**
 * @swagger
 * /auth/logout:
 *   delete:
 *     summary: Log out a user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
authRouter.route("/logout").delete(authenticatedUser, logout);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify a user's email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - verificationToken 
 *               - email
 *             properties:
 *               verificationToken: { type: string, example: 'your-token' }
 *               email: { type: string, example: 'josue.batey@gmail.com' }
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
authRouter.route("/verify-email").post(verifyEmail);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send a password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email: { type: string, example: 'josue.batey@gmail.com' }
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
authRouter.route("/forgot-password").post(forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset a user's password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - email
 *               - password
 *             properties:
 *               token: { type: string, example: 'your-reset-token' }
 *               email: { type: string, example: 'josue.batey@gmail.com' }
 *               password: { type: string, example: 'newPassword123' }
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
authRouter.route("/reset-password").post(resetPassword);

export default authRouter;
