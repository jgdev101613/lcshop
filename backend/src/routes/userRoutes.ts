import { Router } from "express";
import { syncUser, updateUser } from "../controllers/userController";
import { requireAuth } from "@clerk/express";

const userRoutes = Router();

// /api/users/sync - POST => sync the clerk user to our database
userRoutes.post("/sync", requireAuth(), syncUser);
userRoutes.put("/update", requireAuth(), updateUser);

export default userRoutes;
