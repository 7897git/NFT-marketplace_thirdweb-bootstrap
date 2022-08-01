import React from "react";
import Image from "next/image";
import { useContractMetadata } from "@thirdweb-dev/react";
import styles from "../../styles/Theme.module.scss";
import { MARKETPLACE_ADDRESS } from "../../const/Addresses";

export default function Home() {
  const { data: contractMetadata, isLoading: loadingMetadata } =
    useContractMetadata(MARKETPLACE_ADDRESS);

  return (
        <div className={styles.banner}>
            <div className={styles.avatar}>
                <Image className={styles.img_fluid} src={`/electrik.png`} alt="avatar" width={100} height={100} />
            </div>
          {!loadingMetadata ? (
            <>
              <h1>{contractMetadata?.name}</h1>
              <p>{contractMetadata?.description}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
  );
}
