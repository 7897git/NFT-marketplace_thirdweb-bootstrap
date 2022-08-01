import React, { useState } from "react";
import {
  useAddress,
  useMetamask,
  useMarketplace,
  useActiveListings,
  useContractMetadata,
  ThirdwebNftMedia,
} from "@thirdweb-dev/react";
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
<RiEqualizerFill color="#fff" size={45} cursor="pointer" data-bs-toggle="dropdown" className="btn btn-outline border-0" />
  <ul class="dropdown-menu">
    <li><a class={styles.dropdown_item} onClick={() => setFilter(0)}>Direct Listing</a></li>
    <li><a class={styles.dropdown_item} onClick={() => setFilter(1)}>Auction Listing</a></li>
  </ul>
    </div>

        {!isLoading ? (
          <div className={styles.nftBoxGrid}>
            {listings
              ?.filter((listing) => listing.type === filter)
              ?.map((listing) => (
                <a
                  className={styles.nftBox}
                  key={listing.id.toString()}
                  href={`/collections/${listing.id}`}
                >
                  <ThirdwebNftMedia
                    metadata={{ ...listing.asset }}
                    className={styles.nftMedia}
                  />
                    <div className={styles.nftBox_body}>
                  <h4>{listing.asset.name}</h4>
                  <p className="mb-0">
                    {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
                    {listing.buyoutCurrencyValuePerToken.symbol}
                  </p>
                    </div>
                </a>
              ))}
          </div>
        ) : (
<div className={styles.loading}>
        <div class="spinner-border text-light" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
</div>
        )}
</main>
      </div>
    </div>
  );
}
