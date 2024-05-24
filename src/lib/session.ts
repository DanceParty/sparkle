import { SignJWT, jwtVerify } from "jose";
import { getCookie } from "cookies-next";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);
export const expires = 2 * 60 * 60 * 1000;
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession(ctx: GetServerSidePropsContext) {
  const session = getCookie("session", { res: ctx.res, req: ctx.req });
  if (!session) return null;
  return decrypt(session);
}
