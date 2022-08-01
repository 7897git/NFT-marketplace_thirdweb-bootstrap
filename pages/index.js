import {
  useAddress,
  useMetamask
} from "@thirdweb-dev/react";
import Cover from "../components/cover/Cover";
import Home from "../components/home/Home";
import Head from 'next/head'
import { MARKETPLACE_ADDRESS } from "../const/Addresses";
import styles from "../styles/Theme.module.scss";

export default function Listings() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  return (
<>
        {address ? (
          <div>
            <Home />
          </div>
        ) : (
        <div className={styles.cover}>
            <Cover />
        </div>
        )}
</>
  );
}
