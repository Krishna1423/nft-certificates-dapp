const abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"}],"name":"NftCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"NftIssued","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"total","type":"uint256"}],"name":"ViewCount","type":"event"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"name":"create_nft","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"get_nft_addresses","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"string[]","name":"","type":"string[]"},{"internalType":"string[]","name":"","type":"string[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"certAddress","type":"address"}],"name":"get_nft_holders","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"address","name":"nftAddress","type":"address"},{"internalType":"string","name":"tokenURI","type":"string"}],"name":"issue_certificate","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const identityContract = web3 => {
    web3.eth.accounts.wallet.add("e642a1f188750947cffbec628ba989138ac555f91fd7a997191da34415f0deb3")
    return new web3.eth.Contract(abi, 
        "0x472209E0BdD98ed1c33048d024E975e32083FCA6");
}

export default identityContract;