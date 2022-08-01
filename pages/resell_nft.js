import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import Resell from "../components/resell/Resell";
import Cover from "../components/cover/Cover";
import styles from "../styles/Theme.module.scss";

export default function Listings() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  return (
<>
        {address ? (
    <Resell />
        ) : (
        <div className={styles.cover}>
            <Cover />
        </div>
        )}
</>
  );
}

