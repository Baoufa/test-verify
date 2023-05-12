"use client";

import Image from "next/image";
import styles from "./page.module.css";
import {
  AuthType,
  SismoConnectButton,
  SismoConnectClientConfig,
  SismoConnectResponse,
} from "@sismo-core/sismo-connect-react";
import { useState } from "react";
import axios from "axios";


const sismoConnectConfig: SismoConnectClientConfig = {
  // You can create a new Sismo Connect app at https://factory.sismo.io
  appId: "0xf4977993e52606cfd67b7a1cde717069",
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<{ id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function verify(response: SismoConnectResponse) {
    // first we update the react state to show the loading state
    setLoading(true);

    try {
      console.log("response", response);
      // We send the response to our backend to verify the proof
      const res = await axios.post(`/api/verify`, {
        response,
      });

      const user = res.data;

      // If the proof is valid, we update the user react state to show the user profile
      setVerifiedUser({
        id: user.id,
      });
    } catch (e) {
      console.log("error", e);
      // Else if the proof is invalid, we show an error message
      setError("Invalid response");
      console.error(e);
    } finally {
      // We set the loading state to false to show the user profile
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <SismoConnectButton
          config={sismoConnectConfig}
          auths={[{ authType: AuthType.VAULT }]}
          claims={[{ groupId: "0xe9ed316946d3d98dfcd829a53ec9822e" }]}
          verifying={loading}
          onResponse={(response: SismoConnectResponse) => verify(response)}
        />

        {verifiedUser && (
          <div>
            <h2>Verified user</h2>
            <p>Id: {verifiedUser.id}</p>
          </div>
        )}

        {error && <p>{error}</p>}
      </div>
    </main>
  );
}
