/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const logger = require("../logger")(module);
const adminUserId = 'admin';
const adminUserPasswd = 'adminpw';

/**
 *
 * @param {*} FabricCAServices
 * @param {*} ccp
 */
exports.buildCAClient = (FabricCAServices, ccp, caHostName) => {
	// Create a new CA client for interacting with the CA.
	try {
		logger.info('buildCAClient')
		const caInfo = ccp.certificateAuthorities[caHostName]; //lookup CA details from config
		const caTLSCACerts = caInfo.tlsCACerts.pem;
		const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

		console.log(`Built a CA Client named ${caInfo.caName}`);
		return caClient;
	} catch (error) {
		logger.error('buildCAClient', error)
	}
};

exports.enrollAdmin = async (caClient, wallet, orgMspId) => {
	try {
		// Check to see if we've already enrolled the admin user.
		logger.info('enrollAdmin')
		const identity = await wallet.get(adminUserId);
		if (identity) {
			console.log('An identity for the admin user already exists in the wallet');
			return;
		}

		// Enroll the admin user, and import the new identity into the wallet.
		const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd });
		
		
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: orgMspId,
			type: 'X.509',
		};
		await wallet.put(adminUserId, x509Identity);
		console.log('Successfully enrolled admin user and imported it into the wallet');
	} catch (error) {
		console.error(`Failed to enroll admin user : ${error}`);
		logger.error('enrollAdmin', error)
		throw error;
	}
};

exports.registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, affiliation, role, UserRole, OrgName) => {
	try {
		console.log('registerAndEnrollAdmin', userId)

		// Check to see if we've already enrolled the user
		const userIdentity = await wallet.get(userId);
		if (userIdentity) {
			console.log(`An identity for the user ${userId} already exists in the wallet`);
			// return { message: `An identity for the user ${userId} already exists in the wallet`, success: true };
			return 'true';
		}
		console.log("Userid not exist, go for registration")

		// Must use an admin to register a new user
		let adminIdentity = await wallet.get(adminUserId);
		if (!adminIdentity) {
			console.log('An identity for the admin user does not exist in the wallet');
			console.log('Enrolling the admin user and import the new identity into the wallet.');
			await this.enrollAdmin(caClient, wallet, orgMspId);
		}

		adminIdentity = await wallet.get(adminUserId);
		console.log("AdminId found :",adminIdentity)

		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
		const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

		// Register the hospital admin, enroll the hospital admin, and import the new identity into the wallet.
		// if affiliation is specified by client, the affiliation value must be configured in CA
		const secret = await caClient.register({
			affiliation: affiliation,
			enrollmentID: userId,
			role: role,//'admin',
			attrs: [
				{ name: "userRole", value: UserRole, ecert: true },
				// { name: "orgRole", value: OrgRole, ecert: true },
				// { name: "organization", value: OrgName, ecert: true }
			]
		}, adminUser);
		console.log("Secret : ",secret)

		const enrollment = await caClient.enroll({
			enrollmentID: userId,
			enrollmentSecret: secret
		});

		console.log('ca client register successfully.')

		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: orgMspId,
			type: 'X.509',
		};
		console.log('Before wallet.put.')
		await wallet.put(userId, x509Identity);
		console.log(`Successfully registered and enrolled hospital admin ${userId} and imported it into the wallet`);

		//return { message: `Successfully registered and enrolled hospital admin ${userId} and imported it into the wallet`, success: true };
		return 'true';
	} catch (error) {
		console.error(`Failed to register hospital admin : ${error}`);
		logger.error('registerAndEnrollHospitalAdmin', error.message)
		throw error;
		//return {message: error.message,success:false}
	}
};

