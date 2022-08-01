import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import Listing from "../components/listing/Listings";
import Cover from "../components/cover/Cover";
import styles from "../styles/Theme.module.scss";

export default function Listings() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  return (
<>
        {address ? (
          <div>
            <Listing />
          </div>
        ) : (
        <div className={styles.cover}>
            <Cover />
        </div>
        )}
</>
  );
}
