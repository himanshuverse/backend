import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import express from "express"
const router=Router()

router.route("/register").post(registerUser)


export default router  
