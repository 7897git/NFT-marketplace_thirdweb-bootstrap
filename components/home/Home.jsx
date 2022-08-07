import React, { useState } from "react";
import {
  useAddress,
  useMetamask,
  useMarketplace,
  useActiveListings,
  useContractMetadata,
  ThirdwebNftMedia,
} from "@thirdweb-dev/react";
import Link from "next/link";
import Image from "next/image";
import { RiEqualizerFill } from "react-icons/ri";
import { StickyContainer, Sticky } from 'react-sticky';
import Banner from "../../components/banner/Banner"
import { MARKETPLACE_ADDRESS } from "../../const/Addresses";
import styles from "../../styles/Theme.module.scss";

export default function Home() {
  const marketplace = useMarketplace(MARKETPLACE_ADDRESS);
  const { data: listings, isLoading } = useActiveListings(marketplace);

  console.log(listings);

  // Load contract metadata
  const { data: contractMetadata, isLoading: loadingMetadata } =
    useContractMetadata(MARKETPLACE_ADDRESS);
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  const [filter, setFilter] = useState(0); // 0 = direct, auction = 1

  return (
    <div className={styles.container}>
      <div className="container">
        <Banner />
  <main className="main">
        {/* Toggle between direct listing and auction listing */}
    <div className={styles.dropbar}>
<div className="dropup">
<RiEqualizerFill color="#fff" size={45} cursor="pointer" data-bs-toggle="dropdown" className="btn btn-outline border-0" />
  <ul className="dropdown-menu">
    <li className={styles.dropdown_item} onClick={() => setFilter(0)}>Direct Listing </li>
    <li className={styles.dropdown_item} onClick={() => setFilter(1)}>Auction Listing </li>
  </ul>
    </div>
</div>

        {!isLoading ? (
          <div className={styles.nftBoxGrid}>
            {listings
              ?.filter((listing) => listing.type === filter)
              ?.map((listing) => (
            <Link 
                  key={listing.id.toString()}
                  href={`/collections/${listing.id}`}>
                <a
                  className="card" style={{background: 'rgba(255, 255, 255, 0.32)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(5.3px)', border: '5px solid rgb(104 107 110 / 0%)'}}
                >
                  <ThirdwebNftMedia
                    metadata={{ ...listing.asset }}
                    className={styles.nftMedia}
                    alt=""
                  />
<div className={styles.ava}>
<i className={styles.avatar}></i>
</div>
                    <div className={styles.nftBox_body}>
                  <h4>{listing.asset.name}</h4>
                  <p className={`${styles.dFlex} ${styles.dChip}`}>
                    <i className={styles.ftm}></i>
                    {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
                    {listing.buyoutCurrencyValuePerToken.symbol}
                  </p>
                    </div>
                </a>
            </Link>
              ))}
          </div>
        ) : (
<div className={styles.loading}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
</div>
        )}
</main>
      </div>
    </div>
  );
}
