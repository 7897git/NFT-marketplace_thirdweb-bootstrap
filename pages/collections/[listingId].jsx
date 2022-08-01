import {
  MediaRenderer,
  useMarketplace,
  useNetwork,
  useNetworkMismatch,
  useListing,
  useAddress,
  useMakeBid,
  useBuyNow,
} from "@thirdweb-dev/react";
import { ChainId, ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useState } from "react";
import Swal from 'sweetalert2'
import Cover from "../../components/cover/Cover";
import { MARKETPLACE_ADDRESS } from "../../const/Addresses";
import styles from "../../styles/Theme.module.scss";

export default function ListingPage() {
  const router = useRouter();
  const { listingId } = router.query;

  const address = useAddress();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const marketplace = useMarketplace(MARKETPLACE_ADDRESS);
  const { data: listing, isLoading: loadingListing } = useListing(
    marketplace,
    listingId
  );

  if (listing?.secondsUntilEnd === 0) {
  }

  const [bidAmount, setBidAmount] = useState("");

  if (loadingListing) {
    return <div className={styles.loadingOrError}>
<div className="spinner-grow text-light" role="status">
  <span className="visually-hidden">Loading...</span>
</div></div>;
  }

  if (!listing) {
    return <div className={styles.loadingOrError}>Listing not found</div>;
  }

  async function createBidOrOffer() {
    try {
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork(ChainId.Mumbai);
        return;
      }

      // If the listing type is a direct listing, then we can create an offer.
      if (listing?.type === ListingType.Direct) {
        await marketplace?.direct.makeOffer(
          listingId, // The listingId of the listing we want to make an offer for
          1, // Quantity = 1
          NATIVE_TOKENS[ChainId.Mumbai].wrapped.address, // Wrapped Ether address on Rinkeby
          bidAmount // The offer amount the user entered
        );
      }

      // If the listing type is an auction listing, then we can create a bid.
      if (listing?.type === ListingType.Auction) {
        await marketplace?.auction.makeBid(listingId, bidAmount);
      }

      alert(
        `${
          listing?.type === ListingType.Auction ? "Bid" : "Offer"
        } created successfully!`
      );
    } catch (error) {
      console.error(error.message || "something went wrong");
      Swal.fire({
  title: 'Gagal!',
  text: 'Penawaran Gagal, silahkan coba lagi..',
  icon: 'error',
  confirmButtonText: 'Oke'
});
    }
  }

  async function buyNft() {
    try {
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork(ChainId.Mumbai);
        return;
      }

      // Simple one-liner for buying the NFT
      await marketplace?.buyoutListing(listingId, 1);
      Swal.fire({
  title: 'Berhasil!',
  text: 'Pembelian NFT berhasil..',
  icon: 'success',
  confirmButtonText: 'Cool'
});
    } catch (error) {
      console.error(error);
      Swal.fire({
  title: 'Gagal!',
  text: 'Pembelian Gagal, silahkan coba lagi..',
  icon: 'error',
  confirmButtonText: 'Oke'
});
    }
  }

  return (
<>
        {address ? (
<div className="container">
    <div className={styles.container}>
      <div className={styles.listingCollection}>
        <div className="card bg-dark w-100">
          <MediaRenderer
            src={listing.asset.image}
            className={styles.mainNftImage}
            alt=""
            width={500}
            height={500}
          />
        </div>
    <div className="card bg-dark w-100">
        <div className={styles.rightListing}>
    <div className={styles.nft_titlePrice}>
          <h1>{listing.asset.name}</h1>
          <p>
            Owned by <b>{listing.sellerAddress?.slice(0, 6)}</b>
          </p>
          </div>
                <div className={styles.spacerBottom}></div>
          <h4>
            <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
            {listing.buyoutCurrencyValuePerToken.symbol}
          </h4>
<span>{listing.asset.description}</span>
                <div className={styles.spacer}></div>
          <div className={styles.nft_bodyBtn}>
            <button
              style={{ borderStyle: "none" }}
              className={styles.mainButton}
              onClick={buyNft}
            >
              Buy
            </button>

            <div className={styles.nft_bodyAuction}>
              <input
                type="text"
                name="bidAmount"
                className={styles.textInput}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Amount"
                style={{ marginTop: 0, marginLeft: 0, width: 100 }}
                required/>
              <button
                style={{ borderRadius: 0 }}
                className={styles.mainButton}
                onClick={createBidOrOffer}
              >
                Make Offer
              </button>
            </div>
         </div>
       </div>
     </div>
   </div>
  </div>
</div>
        ) : (
        <div className={styles.cover}>
            <Cover />
        </div>
        )}
</>
  );
}
