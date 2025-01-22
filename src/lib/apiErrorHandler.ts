import { NextRequest, NextResponse } from "next/server";

export default function (handler: (...arg: { [key: string]: any }[]) => Promise<any>) {
  return async (req: NextRequest, ...args: Array<Promise<{ [x: string]: any }>>) => {
    try {
      return await handler(req, await args[0]);
    } catch (error: any) {
      console.error("\x1b[31m; An error occurred: %s \x1b[0m;", error);

      return NextResponse.json({ error: { code: error?.code, message: error?.message } }, { status: 500 });
    }
  };
}
