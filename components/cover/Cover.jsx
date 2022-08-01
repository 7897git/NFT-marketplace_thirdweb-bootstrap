import { useContractMetadata, useAddress, useMetamask, useWalletConnect, useCoinbaseWallet } from "@thirdweb-dev/react";
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
    <li><a className={styles.dropdown_item} onClick={() => connectWithMetamask()}>Metamask<i className={styles.metamask} /></a></li>
    <li><a className={styles.dropdown_item} onClick={() => connectWithWalletConnect()}>WalletConect<i className={styles.walletconnect} /></a></li>
    <li><a className={styles.dropdown_item} onClick={() => connectWithCoinbaseWallet()}>CoinBase<i className={styles.coinbase} /></a></li>
  </ul>
    </p>
            </>
          ) : (
            <p className="lead">authorize...</p>
          )}
  </main>

  <footer className="mt-auto text-white-50">
    <p>UnknownNFT <a href="/" className="text-white">marketplace</a>, by <a href="https://thirdeweb.com" className="text-white">thirdweb SDK</a>.</p>
  </footer>
</div>
  );
}
