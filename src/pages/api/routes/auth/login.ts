// api/auth/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/tokenMiddleware";
import { serialize } from "cookie";

export default async function LoginHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ message: "اطلاعات ورود نادرست است." });

    try {
      const user = await prisma.users.findFirst({
        where: { OR: [{ username: identifier }, { email: identifier }] },
      });
      if (!user)
        return res
          .status(404)
          .json({ message: "کاربری با این مشخصات پیدا نشد." });

      const passwordMatch = await comparePassword(password, user.password_hash);
      if (!passwordMatch)
        return res.status(401).json({ message: "رمز عبور اشتباه است." });

      const token = generateToken(
        user.user_id,
        user.username,
        user.email,
        user.role as string
      );

      // Send token to Cookie
      res.setHeader(
        "Set-Cookie",
        serialize("authToken", token, {
          httpOnly: true, // Access from server only
          secure: process.env.NODE_ENV === "production", // Active only on production envoiroment
          sameSite: "strict", // Limited to this Domain
          maxAge: 7200, // Expires time
          path: "/", // Access path
        })
      );
      res.status(200).json({ message: "کاربر با موفقیت وارد شد." });
    } catch (error) {
      console.log("Internal Server Error", error);
      return res.status(500).json({ message: "خطای سرور رخ داده است." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Not valid method" });
  }
}
