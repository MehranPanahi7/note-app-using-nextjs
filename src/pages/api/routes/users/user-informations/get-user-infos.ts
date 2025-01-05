/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenMiddleware";

export default async function GetUserInfosHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(400).json({ message: "توکن معتبر نیست" });
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(400).json({ message: "No Token Provided" });

    try {
      const decodedToken: any = verifyToken(token);
      const user_id = decodedToken.user_id;
      if (!user_id) return res.status(403).json({ message: "دسترسی غیر مجاز" });

      const getUserInfos = await prisma.users.findUnique({
        where: { user_id },
        select: {
          user_id: true,
          username: true,
          email: true,
          role: true,
          created_at: true,
          updated_at: true,
        },
      });
      if (!getUserInfos)
        return res.status(404).json({ message: "محتوایی پیدا نشد" });

      res.status(200).json({
        message: "اطلاعات کاربر با موفقیت دریافت شد.",
        userInfos: getUserInfos,
      });
    } catch (error) {
      console.log("Internal Server Error", error);
      return res.status(500).json({ message: "خطای سرور رخ داده است" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method is not Allowed" });
  }
}
