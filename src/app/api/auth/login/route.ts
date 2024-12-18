import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";
import authApiRequest from "@/apiRequests/auth";

export async function POST(req: Request) {
  const body = (await req.json()) as LoginBodyType;
  const cookieStore = cookies();
  try {
    const { payload } = await authApiRequest.loginFromNextServerToBeServer(
      body
    );
    const { token, refreshToken } = payload.data;
    //decode access token and refresh token to get the expired time
    const decodeAccessToken = jwt.decode(token) as { exp: number };
    const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number };

    const decodeToken = jwt.decode(token) as { [key: string]: any };
    const userId =
      decodeToken[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];
    const role =
      decodeToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
    // console.log("User ID:", userId);
    // console.log("Role:", role);
    // console.log("1");
    cookieStore.set("accessToken", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeRefreshToken.exp * 1000,
    });
    // console.log("2");
    return Response.json({ userId, role, ...payload });
  } catch (error) {
    // console.log("3");
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    }
    return Response.json({ message: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
