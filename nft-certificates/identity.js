const MyContract = artifacts.require("Management");

module.exports = async function (callback) {
  let accounts = await web3.eth.getAccounts();

  let instance = await MyContract.deployed();
  console.log("Contract instance fetched: ", instance.address);
  let nftAddress = null;
  try {
    let txReceipt = await instance.create_nft(
      "George Brown College, Toronto",
      "GBC",
      ["Department", "Course", "Course code"]
    );
    nftAddress = txReceipt.logs[0].args[0];
    console.log("New NFT contract created at address: ", nftAddress);
  } catch (error) {
    console.log(error.message);
  }

  try {
    let nftAttributes = await instance.get_nft_attributes(nftAddress);
    console.log(nftAttributes);
  } catch (error) {
    console.log(error.message);
  }

  try {
    await instance.issue_certificate(
      accounts[1],
      nftAddress,
      "https://ipfs.io/ipfs/QmaZmECGK1fUyuVtp6VJHjBBPgcETGnN6fS2AsDcGLsXBV",
      { from: accounts[0] }
    );
    await instance.issue_certificate(
      accounts[2],
      nftAddress,
      "https://ipfs.io/ipfs/QmaZmECGK1fUyuVtp6VJHjBBPgcETGnN6fS2AsDcGLsXBV",
      { from: accounts[0] }
    );
    await instance.issue_certificate(
      accounts[3],
      nftAddress,
      "https://ipfs.io/ipfs/QmaZmECGK1fUyuVtp6VJHjBBPgcETGnN6fS2AsDcGLsXBV",
      { from: accounts[0] }
    );
    console.log("Issued a new token for contract address: ", nftAddress);
  } catch (error) {
    console.log(error);
  }

  try {
    await instance.issue_certificate(
      accounts[1],
      nftAddress,
      "https://ipfs.io/ipfs/QmaZmECGK1fUyuVtp6VJHjBBPgcETGnN6fS2AsDcGLsXBV",
      { from: accounts[2] }
    );
    console.log("Issued a new token for contract address: ", nftAddress);
  } catch (error) {
    console.log("Here: ", error);
  }

  try {
    let nftsList = await instance.get_nft_addresses();
    console.log("NFT list of address ", accounts[0], " is: ", nftsList);
  } catch (error) {
    console.log(error);
  }

  try {
    let holdersList = await instance.get_nft_holders(nftAddress);
    console.log("Holders of NFT ", nftAddress, "is: ", holdersList);
  } catch (error) {
    console.log(error);
  }

  callback();
};
