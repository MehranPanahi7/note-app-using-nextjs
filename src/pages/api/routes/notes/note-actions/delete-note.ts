/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenMiddleware";

export default async function DeleteNoteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { note_id } = req.body;
    if (typeof note_id !== "number")
      return res.status(400).json({ message: "شناسه ی یادداشت شناسایی نشد." });

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(400).json({ message: " توکن معتبر نیست" });
    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(400).json({ message: "توکن ارائه نشده است." });

    try {
      const decodedToken: any = verifyToken(token);
      const user_id = decodedToken.user.user_id;
      if (!user_id)
        return res.status(403).json({ message: "دسترسی غیر مجازاست." });

      // Find the note for deleting
      const noteToDelete = await prisma.notes.findFirst({
        where: { note_id, user_id },
      });

      if (!noteToDelete) {
        return res.status(404).json({ message: "یادداشت یافت نشد." });
      }

      const deleteNote = await prisma.notes.delete({
        where: {
          note_id: noteToDelete?.note_id,
        },
      });

      if (!deleteNote)
        return res
          .status(404)
          .json({ message: "پاک کردن یادداشت موفقیت آمیز نبود" });

      res.status(200).json({
        message: "یادداشت با موفقیت حدف شد",
        note_title: noteToDelete?.note_title,
      });
    } catch (error) {
      console.log("Internal Server Error", error);
      return res.status(500).json({ message: "خطای سرور رخ داده است" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ message: "Method is not Allowed!" });
  }
}
