/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenMiddleware";

export default async function EditNoteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { note_id, note_title, note_content } = req.body;
    if (typeof note_id !== "number")
      return res.status(400).json({ message: "شناسه ی یادداشت شناسایی نشد." });

    // Validate note_title and note_content
    if (!note_title && !note_content)
      return res.status(400).json({
        message: "اطلاعاتی برای ویرایش یادداشت ارسال نشده است.",
      });

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(400).json({ message: " توکن معتبر نیست" });
    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(400).json({ message: "توکن ارائه نشده است." });

    try {
      const decodedToken: any = verifyToken(token);
      const user_id = decodedToken.user_id;
      if (!user_id)
        return res.status(403).json({ message: "دسترسی غیر مجازاست." });

      // Find the note for deleting
      const noteToEdit = await prisma.notes.findFirst({
        where: { note_id, user_id },
      });
      if (!noteToEdit) {
        return res.status(404).json({ message: "یادداشت یافت نشد." });
      }

      const editNote = await prisma.notes.update({
        where: { note_id },
        data: {
          note_title: note_title || noteToEdit.note_title,
          note_content: note_content || noteToEdit.note_content,
        },
      });

      if (!editNote)
        return res
          .status(404)
          .json({ message: "پاک کردن یادداشت موفقیت آمیز نبود" });

      res.status(200).json({
        message: "یادداشت با موفقیت ویرایش شد.",
        note_title: noteToEdit?.note_title,
      });
    } catch (error) {
      console.log("Internal Server Error", error);
      return res.status(500).json({ message: "خطای سرور رخ داده است" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ message: "Method is not Allowed@" });
  }
}
