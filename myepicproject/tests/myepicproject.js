const anchor = require('@project-serum/anchor');

// Meed tje system program
const { SystemProgram } = anchor.web3;

describe('myepicproject', () => {

  console.log("🚀 Starting test...");

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;

  const baseAccount = anchor.web3.Keypair.generate();

  it('Is initialized!', async () => {
    // Add your test here.
    const program = anchor.workspace.Myepicproject;
    const tx = await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    console.log("Your transaction signature", tx);

  });

  it('adds a gif', async () => {
    const program = anchor.workspace.Myepicproject;

    // Fetch data from the account
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count', account.totalGifs.toString());

    // Call add_gif!
    await program.rpc.addGif("https://media.giphy.com/media/RVuNZB864BeVy/giphy.gif", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey
      },
    });

    // Get the account again to see what changed.
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count', account.totalGifs.toString())

    // Access gif_list on the account
    console.log("👀 GIF List", account.gifList);
  });
});