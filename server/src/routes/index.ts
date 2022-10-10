import { Router } from "express";
import validate from "../middleware/validate";
import { createUserSchema } from "../schema/user.schema";
import { createUserHandler } from "../controller/user.controller";

const router = Router();

// @path /api/checkhealth
router.get("/checkhealth", (_, res) => {
  res.sendStatus(200);
});

/*
 * GET /user/:id -> go to the user page
 * POST /user -> register user
 * UPDATE /user/:id -> update user
 * DELETE /user/:id -> delete user
 */

/*
 * GET /user/:id
 ** to see all the post made by that user
 ** only the user, club members or admins can go to the user's page
 *** a user can't go to another user's page
 */

/*
 * UPDATE /user/:id
 ** only the user can edit there page
 */

/*
 * POST /user
 ** there needs to be a create user schema
 */

/*
 * DELETE /user/:id
 ** only an admin or owner of id can delete the user
 ** just add the user to the banned list??
 */

// test that only valid users are created
// @type POST
// @path /api/user
router.post("/user", validate(createUserSchema), createUserHandler);

export default router;
