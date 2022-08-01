import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "../styles/globals.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const activeChainId = ChainId.Mumbai;

function MyApp({ Component, pageProps }) {

useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
}, []);

  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </ThirdwebProvider>
  );
}

export default MyApp;
