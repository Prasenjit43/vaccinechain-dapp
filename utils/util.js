const {  Wallets } = require("fabric-network");
const { buildWallet, buildCCPOrg } = require("./AppUtil");
const path = require('path');
const config = require('../config/cred');

const getContractObject = async (orgName, user, channelName, contractName, gateway) => {

  let walletPath;
  walletPath = '../wallet/' + orgName;
  console.log("walletPath : ", walletPath)

  const ccp = buildCCPOrg(orgName);
  const walletPathOrg = path.join(__dirname, walletPath);
  const wallet = await buildWallet(Wallets, walletPathOrg);

  let discoverAsLocalHost = true;
  config.DISCOVERY_AS_LOCALHOST == 'false' ? discoverAsLocalHost = false : discoverAsLocalHost = true
  await gateway.connect(ccp,
    { wallet: wallet, identity: user, discovery: { enabled: true, asLocalhost: discoverAsLocalHost } });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(contractName);
  return  contract ;
}

module.exports = {
  getContractObject
}