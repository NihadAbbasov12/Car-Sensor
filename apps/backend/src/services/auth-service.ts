import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/http";

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, "Invalid credentials");
  }

  const token = jwt.sign({ username: user.username }, config.JWT_SECRET, {
    subject: user.id,
    expiresIn: "7d",
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  };
}
