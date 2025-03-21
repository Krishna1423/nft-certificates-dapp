import Head from "next/head";
import { useState, useEffect } from "react";
import Web3 from "web3";
import { pinata } from "../utils/config.js";
import identityContract from "../blockchain/certificate";
import "bulma/css/bulma.css";
import styles from "../styles/NftCertificate.module.css";

const NFTCertificate = () => {
  const [connectWalletError, setConnectWalletError] = useState("");
  const [nftContractsMessage, setNftContractsMessage] = useState("");
  const [createNftMessage, setCreateNftMessage] = useState("");
  const [issueNftMessage, setIssueNftMessage] = useState("");
  const [nftContracts, setNftContracts] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState("");
  const [myContract, setMyContract] = useState(null);
  const [nftFile, updateNftFile] = useState(null);

  //const client = create("https://aquamarine-above-viper-774.mypinata.cloud/ipfs");

  useEffect(() => {
    if (myContract && address) getNftContracts();
  }, [myContract, address]);

  useEffect(() => {
    const tabs = document.querySelectorAll(".tabs li");
    const tabContentBoxes = document.querySelectorAll(
      "#tabs-content > section"
    );

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((item) => item.classList.remove("is-active"));
        tab.classList.add("is-active");

        const target = tab.dataset.target;
        console.log(tabContentBoxes);
        tabContentBoxes.forEach((box) => {
          console.log(target, box.id);
          if (box.id == target) box.classList.remove("is-hidden");
          else box.classList.add("is-hidden");
        });
      });
    });
  }, []);

  function extractColumn(arr, column) {
    return arr.map((x) => x[column]);
  }

  function updateText(id, status, message) {
    document.getElementById(id).className = "container has-text-" + status;
    const funName = "set" + id;
    // console.log("Fun name is ", funName)
    eval(funName)(message);
  }

  const getNftContracts = async () => {
    updateText("NftContractsMessage", "danger");
    if (web3 == "undefined") await connectGanacheHandler();

    try {
      const gasEstimate = await myContract.methods
        .get_nft_addresses()
        .estimateGas({ from: address });
      console.log("Estimated Gas:", gasEstimate);

      const nftAdresses = await myContract.methods
        .get_nft_addresses()
        .call({ from: address, gas: gasEstimate + 50000 });
      console.log(nftAdresses);
      const resLength = Object.keys(nftAdresses).length;

      // Converting object to Array type
      var array = [];
      for (var i = 0; i < resLength; i++) {
        array.push(nftAdresses[i]);
      }

      console.log(nftAdresses[0].length);
      var result = [];
      for (var i = 0; i < array[0].length; i++) {
        // console.log(i, extractColumn(array, i))
        result.push(extractColumn(array, i));
      }
      setNftContracts(result);
      updateText("NftContractsMessage", "info", "");
    } catch (error) {
      console.log("Error fetching NFT addresses", error);
      updateText("NftContractsMessage", "danger", error.message);
    }
  };

  // const connectWalletHandler = async () => {
  //   /* Check if metamask is installed */
  //   const provider = await detectEthereumProvider();
  //   console.log("Entering handler");
  //   if (provider) {
  //     try {
  //       // It is metamask ethereum provider API
  //       /* Requesting wallet connect */
  //       await provider.request({ method: "eth_requestAccounts" });
  //       web3 = new Web3(provider);
  //       setWeb3(web3);
  //       console.log("Conection successful");
  //       setConnectWalletError("");
  //       /* Get accounts List */
  //       const accounts = await web3.eth.getAccounts();
  //       console.log(accounts[0]);
  //       setAddress(accounts[0]);

  //       /* Create local vm copy */
  //       const vm = identityContract(web3);
  //       setMyContract(vm);
  //       setConnectWalletError("");

  //       let button = document.getElementById("connectButton");
  //       button.style.display = "none";

  //       let adr = document.getElementById("connectAddress");
  //       adr.style.display = "block";
  //     } catch (error) {
  //       setConnectWalletError(error.message);
  //     }
  //   } else {
  //     // Metamask not installed
  //     setConnectWalletError("Please install Metamask");
  //   }
  // };

  const connectGanacheHandler = async () => {
    console.log("Entering handler");

    try {
      const ganacheProvider = new Web3.providers.HttpProvider(
        "http://localhost:8545"
      );

      //  Initialize Web3 with Ganache provider
      const web3 = new Web3(ganacheProvider);
      setWeb3(web3);
      console.log("Connected to Ganache");

      /*  Get accounts from Ganache */
      const accounts = await web3.eth.getAccounts();

      if (accounts.length === 0) {
        throw new Error("No accounts found. Make sure Ganache is running.");
      }

      console.log("Ganache Accounts:", accounts);
      setAddress(accounts[0]); // Use the first Ganache account

      /*  Create contract instance using Ganache Web3 */
      const vm = identityContract(web3); // Make sure this function is correctly importing your contract
      setMyContract(vm);

      // /* ✅ Hide Connect Button */
      // let button = document.getElementById("connectButton");
      // if (button) button.style.display = "none";

      let adr = document.getElementById("connectAddress");
      if (adr) adr.style.display = "block";

      // Clear error message
      setConnectWalletError("");
    } catch (error) {
      console.error("Error connecting to Ganache:", error);
      setConnectWalletError(error.message);
    }
  };

  const createNftHandler = async () => {
    updateText("IssueNftMessage", "info", "");
    updateText("CreateNftMessage", "info", "Please wait...");

    if (web3 == "undefined") await connectGanacheHandler();
    const inputs = document.querySelectorAll("#createNftform input");

    let tokenName, tokenSymbol, attributeNames;
    inputs.forEach((input) => {
      if (input.name == "tokenName") tokenName = input.value;
      else if (input.name == "tokenSymbol") tokenSymbol = input.value;
      else if (input.name == "attributeName")
        attributeNames = input.value.split(",");
    });

    console.log(attributeNames);
    console.log(tokenName, tokenSymbol, attributeNames);
    try {
      const gasEstimate = await myContract.methods
        .create_nft(tokenName, tokenSymbol, attributeNames)
        .estimateGas({ from: address });
      console.log("Estimated Gas:", gasEstimate);

      const result = await myContract.methods
        .create_nft(tokenName, tokenSymbol, attributeNames)
        .send({ from: address, gas: gasEstimate + 50000 });
      console.log(result);
      console.log("Available events: " + Object.keys(result.events));
      console.log("Logs: " + result.logs);
      const tokenAddress =
        result.events["NftCreated"].returnValues["tokenAddress"];
      console.log(tokenAddress);
      updateText(
        "CreateNftMessage",
        "success",
        "Created NFT Contract at: " + tokenAddress
      );
      await getNftContracts();
    } catch (error) {
      updateText(
        "CreateNftMessage",
        "danger",
        "Error creating NFT contract: " + error.message
      );
    }
  };

  const issueNftHandler = async () => {
    updateText("CreateNftMessage", "info", "");
    updateText("IssueNftMessage", "info", "Please wait...");
    if (web3 == "undefined") await connectGanacheHandler();

    const inputs = document.querySelectorAll("#issueNftForm input");

    let receiverAddress, nftContract;
    let json = {};
    inputs.forEach((input) => {
      // console.log(input)
      if (input.name == "receiverAddress") receiverAddress = input.value;
      else if (input.name == "nftContract") nftContract = input.value;
      else if (input.name == "nftName") json["name"] = input.value;
      else if (input.name == "nftDescription")
        json["description"] = input.value;
    });

    // TODO: write precondition test for all
    if (nftFile == null) {
      updateText("IssueNftMessage", "danger", "Please upload NFT file");
      return;
    }
    //let url = "";
    try {
      //const added = await client.add(nftFile);
      //url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // const uploadRequest = await fetch("/api/files", {
      //   method: "POST",
      //   body: nftFile,
      // });
      // const signedUrl = await uploadRequest.json();

      const { cid } = await pinata.upload.public.file(nftFile);
      const signedUrl = await pinata.gateways.public.convert(cid);
      console.log("Image uploaded to pinata");

      updateText(
        "IssueNftMessage",
        "success",
        "Keep waiting! NFT image URI: " + signedUrl
      );
    } catch (error) {
      updateText("IssueNftMessage", "danger", error.message);
      return;
    }

    json["image"] = signedUrl;

    let attributes = [];
    let attrs = document.querySelectorAll("#attributes input");
    attrs.forEach((a) => {
      let traits = {};
      traits["trait_type"] = a.id;
      traits["value"] = a.value;
      attributes.push(traits);
    });

    json["attributes"] = attributes;
    console.log("I am your json", JSON.stringify(json));

    let tokenURI;
    try {
      const added = await client.add(JSON.stringify(json));
      tokenURI =
        "https://aquamarine-above-viper-774.mypinata.cloud/ipfs/" + added.path;
      updateText(
        "IssueNftMessage",
        "success",
        "Keep waiting! NFT metadata URI: " + tokenURI
      );
    } catch (error) {
      updateText("IssueNftMessage", "danger", error.message);
      return;
    }

    try {
      const gasEstimate = await myContract.methods
        .issue_certificate(receiverAddress, nftContract, tokenURI)
        .estimateGas({ from: address });
      console.log("Estimated Gas:", gasEstimate);

      const result = await myContract.methods
        .issue_certificate(receiverAddress, nftContract, tokenURI)
        .send({ from: address, gasLimit: gasEstimate + 50000 });
      // console.log(result)
      // console.log(result.events)
      const tokenAddress =
        result.events["NftIssued"].returnValues["tokenAddress"];
      const tokenId = result.events["NftIssued"].returnValues["tokenId"];
      console.log(tokenAddress, tokenId);
      updateText(
        "IssueNftMessage",
        "success",
        "Issued NFT: " +
          "https://testnets.opensea.io/assets/" +
          tokenAddress +
          "/" +
          tokenId
      );
      await getNftContracts();
    } catch (error) {
      updateText(
        "IssueNftMessage",
        "danger",
        "Error issuing NFT: " + error.message
      );
    }
  };

  const getNftAttributes = async (contractAddress) => {
    if (web3 == "undefined") await connectGanacheHandler();
    try {
      const result = await myContract.methods
        .get_nft_attributes(contractAddress)
        .call({ from: address });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error.message);
    }
  };

  const createInputField = (name) => {
    var colfield = document.createElement("div");
    colfield.className = "columns";

    var colfield1 = document.createElement("div");
    colfield1.className = "column is-one-fifth";

    var colfield2 = document.createElement("div");
    colfield2.className = "column";

    var label = document.createElement("label");
    label.className = "label";
    label.innerHTML = name;

    var field = document.createElement("div");
    field.className = "field";

    var control = document.createElement("div");
    control.className = "control";

    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "attributes " + name);
    input.setAttribute("id", name);
    input.className = "input";

    control.appendChild(input);
    field.append(control);

    colfield1.appendChild(label);
    colfield2.append(field);

    colfield.append(colfield1);
    colfield.append(colfield2);

    return colfield;
  };

  async function updateImage(e) {
    const file = e.target.files[0];
    updateNftFile(file);
    document.getElementsByClassName("file-name")[0].innerHTML = file.name;
    console.log(file.name);
  }

  const issueThisNft = async (event) => {
    var formSection = document.getElementById("issueNftFormSection");
    var form = document.getElementById("issueNftForm");

    /* Clear the form and remove the previous attributes */
    if (formSection.style.display == "block") {
      document.getElementsByName("receiverAddress")[0].value = "";
      document.getElementsByName("nftName")[0].value = "";
      document.getElementsByName("nftDescription")[0].value = "";
      let attributes = document.getElementById("attributes");
      form.removeChild(attributes);
    }

    /* Move to mint section by simulating the click */
    document.querySelectorAll(".tabs li")[1].click();

    let contractAddress = event.target.dataset.contractAddress;
    let name = event.target.dataset.name;
    let symbol = event.target.dataset.symbol;

    console.log("Here ", contractAddress, name, symbol);

    var newdiv = document.createElement("div");
    newdiv.className = "container";
    newdiv.setAttribute("id", "attributes");
    var newlabel = document.createElement("p");
    newlabel.className = "subtitle";
    newlabel.innerHTML = "NFT Attributes";
    newdiv.appendChild(newlabel);

    formSection.style.display = "block";
    document.getElementsByName("nftContract")[0].value = contractAddress;
    document.getElementsByName("nftContractName")[0].value = name;
    document.getElementsByName("nftContractSymbol")[0].value = symbol;

    let attributes = await getNftAttributes(contractAddress);
    var uploadButton = form.lastChild;
    form.insertBefore(newdiv, uploadButton);
    // form.appendChild(newdiv)
    attributes.forEach((a) => {
      let field = createInputField(a);
      newdiv.appendChild(field);
    });
  };

  return (
    <div className={styles.main}>
      <Head>
        <title>NFT Certificate</title>
        <meta
          name="description"
          content="Create your own organization's NFT and distribute"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
          integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"
          crossOrigin="anonymous"
        />
      </Head>
      <nav className="navbar mt-4 mb-4">
        <div className="container">
          <div className="navbar-brand">
            <h1>NFT Certificates</h1>
          </div>
          <div className="navbar-end">
            <button
              onClick={connectGanacheHandler}
              id="connectButton"
              className="button is-primary"
            >
              Connect Ganache
            </button>
            <div
              id="connectAddress"
              className="container has-text-info"
              style={{ display: "none" }}
            >
              <p>
                Connected to {address.substring(0, 5)}..{address.substring(38)}!
              </p>
            </div>
          </div>
        </div>
      </nav>

      <section>
        <div className="container has-text-danger">
          <p>{connectWalletError}</p>
        </div>
      </section>

      <div className="tabs is-boxed is-centered is-medium">
        <ul>
          <li className="is-active" data-target="contracts-section">
            <a>NFT Contracts</a>
          </li>
        </ul>
        <ul>
          <li data-target="issueNftFormSection">
            <a>Mint</a>
          </li>
        </ul>
        <ul>
          <li data-target="create-nft-section">
            <a>Create</a>
          </li>
        </ul>
      </div>
      <div id="tabs-content">
        <section id="contracts-section">
          <div className="container center">
            <table className="table is-striped is-bordered is-hoverable">
              <thead className="bold">
                <tr>
                  <th>Token name</th>
                  <th>Token symbol</th>
                  <th>Token address</th>
                  <th>Issue count</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {nftContracts &&
                  nftContracts.map((nft) => (
                    <tr key={nft[0]}>
                      <td>{nft[1]}</td>
                      <td>{nft[2]}</td>
                      <td>
                        <a
                          href={"https://rinkeby.etherscan.io/token/" + nft[0]}
                          target="_blank"
                          rel="noreferrer"
                        >
                          etherscan
                        </a>
                      </td>
                      <td>{nft[3]}</td>
                      <td>
                        <button
                          onClick={issueThisNft}
                          data-contract-address={nft[0]}
                          data-name={nft[1]}
                          data-symbol={nft[2]}
                        >
                          Issue
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="container mt-2" style={{ display: "none" }}>
            <button onClick={getNftContracts} className="button is-primary">
              Get tokens
            </button>
            <div id="NftContractsMessage" className="container has-text-info">
              <p>{nftContractsMessage}</p>
            </div>
          </div>
        </section>

        <section
          className="mt-5 is-hidden"
          id="issueNftFormSection"
          style={{ display: "none" }}
        >
          <div className="container" id="issueNftForm">
            <p className="title">Mint NFT</p>
            <div className="columns">
              <div className="column is-one-third">
                <div className="field">
                  <div className="control">
                    <input
                      className="input"
                      type="type"
                      name="nftContract"
                      disabled
                    ></input>
                  </div>
                </div>
              </div>
              <div className="column is-one-third">
                <div className="field">
                  <div className="control">
                    <input
                      className="input"
                      type="type"
                      name="nftContractName"
                      disabled
                    ></input>
                  </div>
                </div>
              </div>
              <div className="column is-one-third">
                <div className="field">
                  <div className="control">
                    <input
                      className="input"
                      type="type"
                      name="nftContractSymbol"
                      disabled
                    ></input>
                  </div>
                </div>
              </div>
            </div>

            <div className="columns">
              <div className="column is-one-third">
                <label className="label">Receiver Address</label>
                <div className="field">
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="type"
                      name="receiverAddress"
                      placeholder="Enter receiver address"
                    ></input>
                    <span className="icon is-small is-left">
                      <i className="fas fa-address-card"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="column is-one-third">
                <label className="label">Name</label>
                <div className="field">
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="type"
                      name="nftName"
                      placeholder="Enter NFT name"
                    ></input>
                    <span className="icon is-small is-left">
                      <i className="fas fa-keyboard"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="column is-one-third">
                <label className="label">Description</label>
                <div className="field">
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="type"
                      name="nftDescription"
                      placeholder="Enter NFT description"
                    ></input>
                    <span className="icon is-small is-left">
                      <i className="fas fa-keyboard"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div id="file-js-example" className="file has-name mt-4">
              <label className="file-label">
                <input
                  className="file-input"
                  type="file"
                  name="nftFile"
                  onChange={updateImage}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">Choose your NFT</span>
                </span>
                <span className="file-name">File Name</span>
              </label>
            </div>
          </div>
          <div className="container">
            <button
              onClick={issueNftHandler}
              className="button is-primary mt-2"
            >
              Process
            </button>
            <div id="IssueNftMessage" className="container has-text-info">
              <p>{issueNftMessage}</p>
            </div>
          </div>
        </section>

        <section id="create-nft-section" className="is-hidden">
          <div className="container" id="createNftform">
            <p className="title">Create NFT contract</p>
            <div className="field">
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="type"
                  name="tokenName"
                  placeholder="Enter Token Name"
                ></input>
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </div>
            </div>
            <div className="field">
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="type"
                  name="tokenSymbol"
                  placeholder="Enter Token Symbol"
                ></input>
                <span className="icon is-small is-left">
                  <i className="fas fa-heart"></i>
                </span>
              </div>
            </div>
            <div className="field">
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="type"
                  name="attributeName"
                  placeholder="Enter Attribute Names"
                ></input>
                <span className="icon is-small is-left">
                  <i className="fas fa-tags"></i>
                </span>
              </div>
            </div>
            <button onClick={createNftHandler} className="button is-primary">
              Create
            </button>
            <div id="CreateNftMessage" className="container has-text-info">
              <p>{createNftMessage}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NFTCertificate;
