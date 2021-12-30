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
// const TEST_GIFS = [
// 	'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
// 	'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
// 	'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
// 	'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
// ]

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

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
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length >0) {
      console.log("Gif link:", inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue("");
    } else {
      console.log("Empty input. Try again.");
    }
  }

  const onInputChange = (event) => {
    const {value} = event.target;
    setInputValue(value);
  }

  // render this UI when the user hasn't connected the wallet to the app yet
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  )

  // render this UI when user has connected the phantom wallet
  const renderConnectedContainer = () => (
    <div className="connected-container">
      {/* The input and button to start */}
      <form 
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
        >
          <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={onInputChange} />
          <button type="submit" className="cta=button submit-gif-button">Submit</button>
        </form>
      <div className="gif-grid">
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
   )

  // When component first mounts, check to see if connected Phantom wallet
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    }
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIF list...");
      // Call Solana program here

      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

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
          { /* or render the gifs if the wallet is connected */ }
          {walletAddress && renderConnectedContainer()}
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
