import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NFT_COLLECTION_ADDRESS } from "../../const/Addresses";

export default async function generateMintSignature(req, res) {
  // De-construct body from request
  let { address, name, description, image } = JSON.parse(req.body);
  const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "mumbai");

  const nftContract = sdk.getNFTCollection("0x9B45233CB9ecA509a278A9eD406578E8eEb15d17");

  const signedPayload = await nftContract.signature.generate({
    metadata: {
      name: name,
      description: description,
      image: image,
    },
    to: address,
    mintStartTime: new Date(0),
  });

  // return 200 and signedpayload
  res.status(200).json({
    signedPayload: JSON.parse(JSON.stringify(signedPayload)),
  });
}
