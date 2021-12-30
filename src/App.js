import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  "https://media.giphy.com/media/RVuNZB864BeVy/giphy.gif",
  "https://media.giphy.com/media/oBJ3iITOA7mBG/giphy.gif",
  "https://media.giphy.com/media/fnl7WmVTgdS8pRQSLM/giphy.gif",
  "https://media.giphy.com/media/Pnh0Lou03fv92J4puZ/giphy.gif"
]

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);

  // checks if Phantom wallet is connected or not
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");

          // allow us to connect directly with the user's wallet
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with public key: ",
            response.publicKey.toString()
          );

          // Set the user's publicKey in state to be used later!
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // the connect wallet function
  const connectWallet = async () => {
    const {solana} = window;
    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
   };

  // render this UI when the user hasn't connected the wallet to the app yet
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  )

  // When component first mounts, check to see if connected Phantom wallet
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    }
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      {/* Styling fanciness if wallet connected */}
      <div className={walletAddress ? 'authed-container' : 'container'}>
          <div className="header-container">
            <p className="header">🖼 Sesame Street GIF Portal</p>
            <p className="sub-text">
              View your Sesame Street GIF collection in the metaverse ✨
            </p>
            { /* Render the connect to wallet button if we don't have a wallet address */}
            {!walletAddress && renderNotConnectedContainer()}
          </div>
          <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a
              className="footer-text"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`built on @${TWITTER_HANDLE}`}</a>
          </div>
        </div>
      </div>

  );
};

export default App;
