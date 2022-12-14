import { TRegisterSchema } from "../schema/authentication.schema";
import prisma from "../config/prisma";
import env from "../config/env";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { omitFromUser } from "../utils/prismaOmit";

/**
 * @desc function for creating registering user
 * @param request: Express.Request
 * @returns user: PrismaClient.User
 * @returns token: string
 */
export const register = async ({ body }: TRegisterSchema) => {
  const salt = await bcrypt.genSalt(env.SALTWORKFACTOR);
  const hashedPassword = bcrypt.hashSync(body.password, salt);

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      userName: body.userName,
    },
  });

  return {
    user: omitFromUser(user, "password"),
    token: createJwtToken(user),
  };
};

/**
 * @desc function for creating jwt token
 * @param user prisma user
 * @returns token: string
 */
export const createJwtToken = (user: User) => {
  const expiresIn = 24 * 60 * 60; // a day
  const secret = env.JWTSECRET;
  const dataStoredInToken = { id: user.id }; // only store user id
  return jwt.sign(dataStoredInToken, secret, { expiresIn });
};
