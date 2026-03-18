import { Router } from "express";
import { syncUser, updateUser, getUser } from "../controllers/userController";
import { requireAuth } from "@clerk/express";

const userRoutes = Router();

// /api/users/sync - POST => sync the clerk user to our database
userRoutes.post("/sync", requireAuth(), syncUser);
userRoutes.patch("/update", requireAuth(), updateUser);
userRoutes.get("/me", requireAuth(), getUser);

export default userRoutes;
