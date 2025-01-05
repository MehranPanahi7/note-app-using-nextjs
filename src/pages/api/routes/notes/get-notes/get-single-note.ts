/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenMiddleware";

export default async function GetSingleNote(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { note_id } = req.query;
    if (!note_id || isNaN(Number(note_id)))
      return res.status(400).json({ message: "یادداشت پیدا نشد" });

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "توکن معتبر نیست" });
    }
    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "توکن ارائه نشده است." });

    try {
      const decodedToken: any = verifyToken(token);
      const user_id: number = decodedToken?.user_id;
      if (!user_id) return res.status(400).json({ message: "کاربر پیدا نشد" });

      const getNote = await prisma.notes.findFirst({
        where: {
          user_id,
          note_id: parseInt(note_id as string, 10),
        },
      });
      if (!getNote)
        return res.status(404).json({ message: "یادداشتی وجود ندارد" });

      res
        .status(200)
        .json({ message: "یادداشت با موفقیت دریافت شد.", note: getNote });
    } catch (error) {
      console.log("Internal Server Error", error);
      return res.status(500).json({ message: "خطای سرور رخ داده است" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Not Valid Method" });
  }
}
