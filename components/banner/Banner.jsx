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
                <Image className={styles.img_fluid} src={`/thirdweb.svg`} alt="avatar" width={50} height={50} />
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
