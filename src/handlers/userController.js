/*
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser } = require('../../utils/CAUtil.js');
const { buildCCPOrg, buildWallet } = require('../../utils/AppUtil.js');
const logger = require('../../logger')(module);
const { error } = require('console');


exports.registerEnrollEntityIdentity = async (org, user,role,userRole) => {
	try {

		let caOrg;
		let walletPath;
		let mspOrg;
		let department;

		console.log("Inside registerEnrollEntityIdentity ",)

		caOrg = 'ca.' + org + '.example.com';
		console.log(caOrg)
		walletPath = '../../wallet/' + org;
		console.log('walletPath', walletPath)

		mspOrg = 'O' + org.substr(1) + 'MSP';
		console.log("msp Org :", mspOrg)

		department = org + '.department1'
		console.log(department)

		logger.info({ method: 'registerEnrollEntityIdentity' })
		console.log("org:", org, ", user:", user,", role:", role, ", userRole:", userRole)

		const ccpOrg = buildCCPOrg(org);
		const caOrgClient = buildCAClient(FabricCAServices, ccpOrg, caOrg);
		const walletPathOrg = path.join(__dirname, walletPath);
		const walletOrg = await buildWallet(Wallets, walletPathOrg);

		let response = await registerAndEnrollUser(caOrgClient, walletOrg, mspOrg, user, department, role, userRole, "");
		console.log("responseMsg : ", response)
		return response

	}
	catch (err) {
		console.log("Inside catch")
		logger.error({ userInfo: req.loggerInfo, method: 'registerEnrollEntityIdentity', err }, err.message)
	}

}





