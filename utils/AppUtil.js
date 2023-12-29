/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');

exports.buildCCPOrg = (orgName) => {
	try {
		console.log("method: buildCCPOrg")
		let ccpPath ;
		
		let org = orgName+ '.example.com';
		let connection = 'connection-'+orgName+'.json'
		ccpPath = path.resolve(__dirname, '..', '..','fabric-samples', 'test-network', 'organizations', 'peerOrganizations', org, connection);
		console.log('ccpPath----', ccpPath)
		
		const fileExists = fs.existsSync(ccpPath);
		if (!fileExists) {
			throw `Invalid OrgId, Please use the valid Spydra Blockchain OrgId`;
		}
		const contents = fs.readFileSync(ccpPath, 'utf8');
		const ccp = JSON.parse(contents);

		return ccp;
	} catch (error) {
		console.log("Error Message :", error.message, ", method: buildCCPOrg")
	}

	
};


exports.buildWallet = async (Wallets, walletPath) => {
	try {
		console.log("method: buildWallet")
		// Create a new  wallet : Note that wallet is for managing identities.
		let wallet;
		if (walletPath) {
			wallet = await Wallets.newFileSystemWallet(walletPath);
			console.log(`Built a file system wallet at ${walletPath}`);
		} else {
			wallet = await Wallets.newInMemoryWallet();
			console.log('Built an in memory wallet');
		}

		return wallet;
	} catch (error) {
		console.log("Error Message :", error.message, ", method: buildWallet")
	}
};

exports.prettyJSONString = (inputString) => {
	if (inputString) {
		 return JSON.stringify(JSON.parse(inputString), null, 2);
	}
	else {
		 return inputString;
	}
}
