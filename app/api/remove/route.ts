import { db } from "@/app/libs/db";
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

const getTargetDate = () => {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return new Date(now.getTime() - 5.5 * 60 * 60 * 1000);
};
export async function DELETE(req: any, res: any) {
  try {
    const targetDate = getTargetDate();

    const result = await db.langar.deleteMany({
      where: {
        createdAt: {
          lt: targetDate,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} entries deleted`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong while deleting data",
    });
  }
}
