import React, { useState } from "react";
import {
  useMarketplace,
  useNetwork,
  useNetworkMismatch,
  useNFTCollection,
  useAddress,
  useSDK,
  useCreateDirectListing,
  useCreateAuctionListing,
} from "@thirdweb-dev/react";
import Image from "next/image";
import { MARKETPLACE_ADDRESS } from "../../const/Addresses";
import { NFT_COLLECTION_ADDRESS } from "../../const/Addresses";
import { ChainId, NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useRef } from "react";
import styles from "../../styles/Theme.module.scss";

const Create = () => {
  // React SDK hooks
  const address = useAddress();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const sdk = useSDK();
  const nftCollection = useNFTCollection(NFT_COLLECTION_ADDRESS);
  const marketplace = useMarketplace(MARKETPLACE_ADDRESS);
  const { mutate: makeDirectListing } = useCreateDirectListing(marketplace);
  const { mutate: makeAuctionListing } = useCreateAuctionListing(marketplace);

  // Other hooks
  const router = useRouter();
  const [file, setFile] = useState();
  const fileInputRef = useRef(null);

  // This function gets called when the form is submitted.
  async function handleCreateListing(e) {
    try {
      // Prevent page from refreshing
      e.preventDefault();

      // De-construct data from form submission
      const { listingType, name, description, price } = e.target.elements;

      console.log({
        listingType: listingType.value,
        name: name.value,
        description: description.value,
        price: price.value,
      });

      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork?.(ChainId.Mumbai);
        return;
      }

      // Upload image using storage SDK
      const img = await sdk.storage.upload(file);

      // Signature Mint NFT, get info (fetch generate mint signature)
      const req = await fetch("/api/generate-mint-signature", {
        method: "POST",
        body: JSON.stringify({
          address,
          name: e.target.elements.name.value,
          description: e.target.elements.description.value,
          image: img.uris[0],
        }),
      });

      const signedPayload = (await req.json()).signedPayload;

      const nft = await nftCollection?.signature.mint(signedPayload);

      const mintedTokenId = nft.id.toNumber();

      // Store the result of either the direct listing creation or the auction listing creation
      let transactionResult = undefined;

      // Depending on the type of listing selected, call the appropriate function
      // For Direct Listings:
      if (listingType.value === "directListing") {
        transactionResult = await createDirectListing(
          NFT_COLLECTION_ADDRESS,
          mintedTokenId,
          price.value
        );
      }

      // For Auction Listings:
      if (listingType.value === "auctionListing") {
        transactionResult = await createAuctionListing(
          NFT_COLLECTION_ADDRESS,
          mintedTokenId,
          price.value
        );
      }

      // If the transaction succeeds, take the user back to the homepage to view their listing!
      if (transactionResult) {
        router.push(`./`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createAuctionListing(contractAddress, tokenId, price) {
    try {
      makeAuctionListing(
        {
          assetContractAddress: contractAddress, // Contract Address of the NFT
          buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
          currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
          listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
          quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
          reservePricePerToken: 0, // Minimum price, users cannot bid below this amount
          startTimestamp: new Date(), // When the listing will start
          tokenId: tokenId, // Token ID of the NFT.
        },
        {
          onSuccess: (tx) => {
            return tx;
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function createDirectListing(contractAddress, tokenId, price) {
    try {
      makeDirectListing(
        {
          assetContractAddress: contractAddress, // Contract Address of the NFT
          buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
          currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
          listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
          quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
          startTimestamp: new Date(0), // When the listing will start
          tokenId: tokenId, // Token ID of the NFT.
        },
        {
          onSuccess: (tx) => {
            return tx;
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  // Function to store file in state when user uploads it
  const uploadFile = () => {
    if (fileInputRef?.current) {
      fileInputRef.current.click();

      fileInputRef.current.onchange = () => {
        if (fileInputRef?.current?.files?.length) {
          const file = fileInputRef.current.files[0];
          setFile(file);
        }
      };
    }
  };

  return (
    <form onSubmit={(e) => handleCreateListing(e)}>
<div className="container">
      <div className={styles.container_Create}>
        {/* Form Section */}
        <div className={styles.collectionContainer}>
          <h3 className={styles.ourCollection}>
            Upload your NFT to the marketplace:
          </h3>
</div>
<div className={styles.nft_upload}>
<div className="card w-100 bg-dark">
          {file ? (
            <Image
              src={URL.createObjectURL(file)}
              style={{ cursor: "pointer", maxHeight: 500, height: '100%', borderRadius: 8 }}
              onClick={() => setFile(undefined)}
              alt="upload file NFT"
            />
          ) : (
            <div
              className={styles.imageInput}
              onClick={uploadFile}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setFile(e.dataTransfer.files[0]);
              }}
            >
              Drag and drop an image here to upload.
            </div>
          )}
</div>
<div className="card w-100 p-2 bg-dark">

          {/* Toggle between direct listing and auction listing */}
          <div className={styles.listingTypeContainer}>
            <input
              type="radio"
              name="listingType"
              id="directListing"
              value="directListing"
              defaultChecked
              className={styles.listingType}
            />
            <label htmlFor="directListing" className={styles.listingTypeLabel}>
              Direct Listing
            </label>
            <input
              type="radio"
              name="listingType"
              id="auctionListing"
              value="auctionListing"
              className={styles.listingType}
            />
            <label htmlFor="auctionListing" className={styles.listingTypeLabel}>
              Auction Listing
            </label>
          </div>
          <input
            type="file"
            accept="image/png, image/gif, image/jpeg"
            id="profile-picture-input"
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          {/* Sale Price For Listing Field */}
          <input
            type="text"
            name="name"
            className="form-control mb-3"
            placeholder="Name"
            style={{ minWidth: "320px" }}
          />

          {/* Sale Price For Listing Field */}
          <textarea
            type="text"
            name="description"
            className="form-control mb-3"
            placeholder="Description"
            cols="28" rows="5"
            style={{ minWidth: "320px" }}
          />

          {/* Sale Price For Listing Field */}
          <input
            type="text"
            name="price"
            className="form-control mb-3"
            placeholder="Price (in MATIC)"
            style={{ minWidth: "320px" }}
          />
<div className={styles.spacer}></div>
          <button
            type="submit"
            className={styles.mainButton}
            style={{ marginTop: 32, borderStyle: "none" }}
          >
            List NFT now
          </button>
</div>
        </div>
      </div>
</div>
    </form>
  );
};

export default Create;
