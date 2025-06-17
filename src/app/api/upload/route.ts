import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const files = formData.getAll("file") as File[];

  if (files) {
    files.forEach(async (file) => {
      if (file.name === "undefined") return;

      const buffer = Buffer.from(await file.arrayBuffer());

      await fs.promises.writeFile(path.resolve(UPLOAD_DIR, file.name), buffer);
    });
  } else {
    return NextResponse.json({
      success: false,
    });
  }

  return NextResponse.json({
    success: true,
    name: (body.file as File).name,
  });
};
