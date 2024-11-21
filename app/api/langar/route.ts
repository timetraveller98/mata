import { db } from "@/app/libs/db";
import { NextResponse } from "next/server";
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

// GET API
export async function GET() {
  try {
    const data = await db.langar.findMany();
    return NextResponse.json({ data, success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
