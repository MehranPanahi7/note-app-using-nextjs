/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenMiddleware";

export default async function GetAllNotesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "No Token Privided" });
    try {
      const decodedToken: any = verifyToken(token);
      const user_id = decodedToken.user.user_id;
      if (!user_id)
        return res.status(401).json({ message: "کاربر وارد نشده است." });

      const notes = await prisma.notes.findMany({ where: { user_id } });
      if (!notes)
        return res.status(200).json({ message: "کاربر یادداشتی ندارد." });

      res
        .status(200)
        .json({ message: "یادداشت ها با موفقیت دریافت شدند.", notes: notes });
    } catch (error) {
      console.log("Internal server error", error);
      return res.status(501).json({ message: "خطای سرور!" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Not Valid Method" });
  }
}
