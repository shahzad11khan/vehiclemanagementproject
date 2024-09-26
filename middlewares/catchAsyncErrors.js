import { NextResponse } from "next/server";
export const catchAsyncErrors = (theFunction) => {
  return async (Request) => {
    try {
      return await theFunction(Request);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: error.message, status: 500 });
    }
  };
};
