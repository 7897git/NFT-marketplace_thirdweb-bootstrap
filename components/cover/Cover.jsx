import { useContractMetadata, useAddress, useMetamask, useWalletConnect, useCoinbaseWallet } from "@thirdweb-dev/react";
import Link from "next/link";
import { MARKETPLACE_ADDRESS } from "../../const/Addresses";
import styles from "../../styles/Theme.module.scss";

export default function Footer() {
  const { contractMetadata, isLoading: loadingMetadata } = useContractMetadata(MARKETPLACE_ADDRESS);

  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();

  return (
<div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
  <header className="mb-auto">
    <div>
      <h3 className="float-md-start mb-0"></h3>
    </div>
  </header>

  <main className="px-3">
    <h1>Thirdweb NFT Marketplace</h1>
    <p className="lead">Discover, Buy, and Sell extraordinary NFT</p>
          {!loadingMetadata ? (
            <>
    <p className="lead">
      <a role="button" className="btn btn-lg btn-secondary fw-bold border-white bg-white text-bg-light" data-bs-toggle="dropdown">SignIn Wallet</a>

  <ul className="dropdown-menu">
    <li className={styles.dropdown_item} onClick={() => connectWithMetamask()}>Metamask<i className={styles.metamask} /> 
    </li>
    <li className={styles.dropdown_item} onClick={() => connectWithWalletConnect()}>WalletConect<i className={styles.walletconnect} /> 
    </li>
    <li className={styles.dropdown_item} onClick={() => connectWithCoinbaseWallet()}>CoinBase<i className={styles.coinbase} /> 
    </li>
  </ul>
    </p>
            </>
          ) : (
            <p className="lead">authorized...</p>
          )}
  </main>

  <footer className="mt-auto text-white-50">
    <p>UnknownNFT <Link href="/"><a className="text-white">marketplace</a></Link>, by <Link href="https://thirdeweb.com"><a className="text-white">thirdweb SDK</a></Link>.</p>
  </footer>
</div>
  );
}
