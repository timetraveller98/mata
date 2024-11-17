import { db } from "@/app/libs/db";
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
export async function POST(req: any) {
  try {
    const body = await req.json();
    const {
      imgUrl,
      puri,
      roti,
      dal,
      kadi,
      chhole,
      chawal,
      biryani,
      kaddu,
      halwa,
      kheer,
      paneer,
      gobhi,
      aloo,
      name,
      address,
      time,
      state,
      district,
      pincode,
    } = body;
    const langars = await db.langar.create({
      data: {
        imgUrl,
        puri,
        roti,
        dal,
        kadi,
        chhole,
        chawal,
        biryani,
        kaddu,
        halwa,
        kheer,
        paneer,
        gobhi,
        aloo,
        name,
        address,
        time,
        state,
        district,
        pincode,
      },
    });

    return NextResponse.json(
      { user: langars, message: "Langar Added successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}


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
