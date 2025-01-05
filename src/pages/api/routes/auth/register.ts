/* eslint-disable @typescript-eslint/no-explicit-any */
// api/auth/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/tokenMiddleware";
import { validateRegister } from "@/lib/validation";

export default async function RegisterHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    validateRegister(req, res, async () => {
      const { username, email, password } = req.body;
      if (!username)
        return res.status(400).json({ message: "نام کاربری ضروری است" });
      if (!email) return res.status(400).json({ message: "ایمیل ضروری است" });
      if (!password)
        return res.status(400).json({ message: "پسوورد ضروری است" });

      try {
        const existingUser = await prisma.users.findFirst({
          where: { OR: [{ username }, { email }] },
        });
        if (existingUser) {
          return res
            .status(400)
            .json({ message: "کاربر قبلا ثبت نام شده است" });
        }
        const hashingPassword = await hashPassword(password);
        const newUser = await prisma.users.create({
          data: {
            username: username,
            email: email,
            password_hash: hashingPassword,
            role: "user",
          },
        });

        res
          .status(201)
          .json({ message: "حساب کاربری ساخته شد.", user_id: newUser.user_id });
      } catch (error: any) {
        console.log("Internal Server Error", error);
        return res.status(500).json({ message: "خطای سرور رخ داده است" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Not valid method" });
  }
}
