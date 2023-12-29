/*
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets,Gateway } = require('fabric-network');
const path = require('path');
const { buildCCPOrg, buildWallet } = require('../../utils/AppUtil.js');
const { NETWORK_PARAMETERS } = require('../../utils/Constants.js');
const { blockListener,contractListener } = require('../../utils/Listeners.js');
const config = require('../../config/cred.js');


exports.startEventListener = async () => {
	try {
		console.log("Inside startEventListener ")
		const gateway = new Gateway();

		let walletPath;
		let orgName = 'org1'
		walletPath = '../../wallet/' + orgName;
		console.log("walletPath : ", walletPath)

		const ccp = buildCCPOrg(orgName);
		const walletPathOrg = path.join(__dirname, walletPath);
		const wallet = await buildWallet(Wallets, walletPathOrg);

		const identity = await wallet.get('admin');
		if (identity) {
			let discoverAsLocalHost = true;
			config.DISCOVERY_AS_LOCALHOST == 'false' ? discoverAsLocalHost = false : discoverAsLocalHost = true
			await gateway.connect(ccp,
				{ wallet: wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: discoverAsLocalHost } });
			const network = await gateway.getNetwork(NETWORK_PARAMETERS.CHANNEL_NAME);
			const contract = network.getContract(NETWORK_PARAMETERS.CHAINCODE_NAME);
			await network.addBlockListener(blockListener);
			await contract.addContractListener(contractListener);
		}
	} catch (error) {
		console.log("Inside Catch block")
		console.log("Error : ",error.message)		
	}

}
 



 
