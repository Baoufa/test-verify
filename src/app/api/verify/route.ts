// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  SismoConnect,
  SismoConnectServerConfig,
  AuthType,
  SismoConnectVerifiedResult,
  SismoConnectResponse,
} from "@sismo-core/sismo-connect-server";
import { NextResponse } from "next/server";

/************************************************ */
/********* A SIMPLE IN-MEMORY DATABASE ********** */
/************************************************ */

type UserType = {
  id: string;
};

// this is a simple in-memory user store
class MyLocalDataBase {
  private userStore = new Map<string, UserType>();

  public getUser(userId: string): UserType | undefined {
    return this.userStore.get(userId);
  }

  public setUser(user: UserType): void {
    this.userStore.set(user.id, user);
  }
}
const userStore = new MyLocalDataBase();

/************************************************ */
/************* CONFIGURE SISMO CONNECT ********** */
/************************************************ */

// define the SismoConnect configuration
const sismoConnectConfig: SismoConnectServerConfig = {
  // you can create a new Sismo Connect app at https://factory.sismo.io
  appId: "0xf4977993e52606cfd67b7a1cde717069",
};

// create a SismoConnect instance
const sismoConnect = SismoConnect(sismoConnectConfig);

/************************************************ */
/***************** THE API ROUTE **************** */
/************************************************ */

// this is the API route that is called by the SismoConnectButton
export async function POST(req: Request) {
  const { response } = await req.json();

  console.log("response", response);
  try {
    console.log("VERIFYING")
    const result: SismoConnectVerifiedResult = await sismoConnect.verify(
      response,
      {
        auths: [{ authType: AuthType.VAULT }],
        claims: [{ groupId: "0xe9ed316946d3d98dfcd829a53ec9822e" }],
      }
    );
    console.log("VERIFIED")


    const user: UserType = {
      // the userId is an app-specific, anonymous identifier of a vault
      // userId = hash(userVaultSecret, appId).
     // id: result.getUserId(AuthType.VAULT) as string,
     id: "123"
    };

    // save the user in the user store DB
    userStore.setUser(user);

    return NextResponse.json(user);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(null);
  }
}
