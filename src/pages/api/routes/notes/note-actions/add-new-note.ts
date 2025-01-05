/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenMiddleware";

export default async function AddNewNoteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { note_title, note_content } = req.body;
    if (!note_title)
      return res
        .status(400)
        .json({ message: "موضوعی برای یادداشت تعیین نشده است." });
    if (!note_content)
      return res.status(400).json({ message: "متن یادداشت وارد نشده است." });

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "توکن معتبر نیست" });
    }
    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "توکن ارائه نشده است." });

    try {
      const decodedToken: any = verifyToken(token);
      const user_id = decodedToken.user_id;
      if (!user_id) return res.status(403).json({ message: "کاربر پیدا نشد" });

      const newNote = await prisma.notes.create({
        data: {
          user_id,
          note_title,
          note_content,
        },
      });

      res
        .status(201)
        .json({ message: "یادداشت با موفقیت اضافه شد.", note: newNote });
    } catch (error) {
      console.log("Internal Sever Error", error);
      return res.status(500).json({ message: "خطای سرور رخ داده است" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method is not Allowed" });
  }
}
