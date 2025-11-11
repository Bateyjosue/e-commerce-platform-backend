import express from "express"

import {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
} from "../controllers/userController"
import {authorizePermissions} from "../middleware"

const  userRouter = express.Router()

userRouter.route("/").get(authorizePermissions("admin"), getAllUsers);
userRouter.route("/showMe").get(showCurrentUser);
userRouter.route("/updateUser").patch(updateUser);
userRouter.route("/updateUserPassword").patch(updateUserPassword);
userRouter.route("/:id").get(getSingleUser);

export default userRouter;