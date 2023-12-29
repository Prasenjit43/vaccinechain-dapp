/*
 * Copyright Paramount soft. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway } = require('fabric-network');
const { getContractObject } = require('../../utils/util.js');
const { NETWORK_PARAMETERS } = require('../../utils/Constants.js');
const { contractListener } = require('../../utils/Listeners.js');
const {registerEnrollEntityIdentity} = require('./userController.js')

class VaccineChainController {

	constructor() {
	}

	async addAdmin(req, res, next) {
		try {
			console.log('******* Adding Admin Details *******')

			let orgName = req.body.orgName
			let user = req.body.data.id;
			let adminId = req.body.adminId;
			let userRole = req.body.data.docType;
			let adminDef = req.body.data;

			console.log("orgname 	:", orgName)
			console.log("user 		:", user)
			console.log("adminId 	:", adminId)
			console.log("userRole 	:", userRole)
			console.log("adminDef 	:", adminDef)
			console.log("JSON.stringify(adminDef) : ", JSON.stringify(adminDef))


			const gateway = new Gateway();
			let  contract  = await getContractObject(orgName, adminId, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log('----------Creating Admin Record details------------\n', adminDef)
			let stateTxn = contract.createTransaction('VaccineChainAdmin');
			await stateTxn.submit(JSON.stringify(adminDef));
			console.log('*** Admin Details Added: committed');


			/*Creating vaccine chain admin Identity*/
			await registerEnrollEntityIdentity(orgName,user,'admin',userRole)


		

			return res.status(200).send({
				success: true,
				responseMsg: "Admin Details Added Successfully"
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: VaccineChainAdmin")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}

	}

	async addEntity(req, res, next) {
		try {
			console.log(`*******Adding ${req.body.data.docType} Details *******`)

			let orgName = req.body.orgName
			let userRole = req.body.data.docType
			let admin = req.body.adminId;
			let user = req.body.data.id
			let entityDef = req.body.data;

			console.log("orgname 		:", orgName)
			console.log("userRole 		:", userRole)
			console.log("id  			:", user)
			console.log("admin 			:", admin)
			console.log("entityDef 		:", entityDef)
			console.log("JSON.stringify(entityDef) : ", JSON.stringify(entityDef))

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, admin, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log(`----------Creating ${req.body.data.docType} Record details------------\n`, entityDef)
			let stateTxn = contract.createTransaction('AddEntity');
			await stateTxn.submit(JSON.stringify(entityDef));
			console.log('*** Entity Details Added: committed');

			/*Creating entity Identity*/
			await registerEnrollEntityIdentity(orgName,user,'client',userRole)

			return res.status(200).send({
				success: true,
				responseMsg: `${req.body.data.docType} Details Added Successfully`,
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: AddEntity")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}

	async addProduct(req, res, next) {
		try {
			console.log(`*******Adding Product Details *******`)

			let orgName = req.body.orgName
			let owner = req.body.owner;
			let productDef = req.body.data;

			console.log("orgname 			:", orgName)
			console.log("owner				:", owner)
			console.log("productDef 		:", productDef)
			console.log("JSON.stringify(productDef) : ", JSON.stringify(productDef))

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, owner, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log(`----------Creating Product Record details------------\n`, productDef)
			let stateTxn = contract.createTransaction('AddProduct');
			await stateTxn.submit(JSON.stringify(productDef));
			console.log('*** Product Details Added: committed');
			return res.status(200).send({
				success: true,
				responseMsg: `Product Details Added Successfully`,
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: AddProduct")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}

	async createBatch(req, res, next) {
		try {
			console.log(`*******Creating Batch Details *******`)

			let orgName = req.body.orgName
			let manufacturerId = req.body.data.owner;
			let batchDef = req.body.data;
			let manufacturingDate = req.body.data.manufacturingDate;
			let unixTimestamp_manufacturingDate = new Date(manufacturingDate).getTime() / 1000;
			let expiryDate = req.body.data.expiryDate;
			let unixTimestamp_expiryDate = new Date(expiryDate).getTime() / 1000;
			req.body.data.manufacturingDate=unixTimestamp_manufacturingDate
			req.body.data.expiryDate=unixTimestamp_expiryDate

			console.log("orgname 			:", orgName)
			console.log("manufacturerId		:", manufacturerId)
			console.log("batchDef 			:", batchDef)
			console.log("JSON.stringify(batchDef) : ", JSON.stringify(batchDef))

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, manufacturerId, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log(`----------Creating Batch Record details------------\n`, batchDef)
			let stateTxn = contract.createTransaction('AddBatch');
			await stateTxn.submit(JSON.stringify(batchDef));
			console.log('*** Batch Details Added: committed');
			return res.status(200).send({
				success: true,
				responseMsg: `Batch Details Added Successfully`
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: AddBatch")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}

	async supplyToDistributer(req, res, next) {
		try {
			console.log(`*******Shipment To Distributer *******`)

			let orgName = req.body.orgName
			let manufacturerId = req.body.owner;
			let shipmentDef = req.body.data;

			console.log("orgname 						:", orgName)
			console.log("shippemntDef 					:", shipmentDef)
			console.log("JSON.stringify(shippemntDef) 	: ", JSON.stringify(shipmentDef))

			// Get current date in UTC
			const currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0); 
			const unixTimestamp = Math.floor(currentDate.getTime() / 1000);
			req.body.data.transactionDate = unixTimestamp
			console.log("currentDateUnix : ", unixTimestamp)


			const gateway = new Gateway();
			let contract = await getContractObject(orgName, manufacturerId, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			// await contract.addContractListener(contractListener);
			console.log(`----------Creating Shippment------------\n`, shipmentDef)
			let stateTxn = contract.createTransaction('ShipToDistributor');
			await stateTxn.submit(JSON.stringify(shipmentDef));
			console.log('*** Shippment to Distributer: committed');
			return res.status(200).send({
				success: true,
				responseMsg: `Shipment Completed Successfully`
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: ShipToDistributer")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}

	async supplyToChemist(req, res, next) {
		try {
			console.log(`*******Shipment To Chemist *******`)

			let orgName = req.body.orgName
			let shippemntDef = req.body.data;
			let distributerId = req.body.owner;

			console.log("orgname 			:", orgName)
			console.log("distributerId 			:", distributerId)
			console.log("JSON.stringify(shippemntDef) : ", JSON.stringify(shippemntDef))

			const currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0); 
			const unixTimestamp = Math.floor(currentDate.getTime() / 1000);
			req.body.data.transactionDate = unixTimestamp
			console.log("currentDateUnix : ", unixTimestamp)

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, distributerId, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log(`----------Creating Shippment------------\n`, shippemntDef)
			let stateTxn = contract.createTransaction('ShipToChemist');
			await stateTxn.submit(JSON.stringify(shippemntDef));
			console.log('*** Shipment : committed');
			return res.status(200).send({
				success: true,
				responseMsg: `Shipment Completed Successfully`
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: ShipToChemist")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}

	async sellToCustomer(req, res, next) {
		try {
			console.log('*******Sell To Customer *******')

			let orgName = req.body.orgName
			let sellingDef = req.body.data;
			let chemistId = req.body.owner;

			console.log("orgname 			:", orgName)
			console.log("chemistId 			:", chemistId)
			console.log("JSON.stringify(sellingDef) : ", JSON.stringify(sellingDef))

			const currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0); 
			const unixTimestamp = Math.floor(currentDate.getTime() / 1000); 
			req.body.data.transactionDate = unixTimestamp
			console.log("currentDateUnix : ", unixTimestamp)

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, chemistId, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log(`----------Selling Packet------------\n`, sellingDef)
			let stateTxn = contract.createTransaction('ShipToCustomer');
			await stateTxn.submit(JSON.stringify(sellingDef));
			console.log('*** Selling : committed');
			return res.status(200).send({
				success: true,
				responseMsg: 'Selling Completed Successfully'
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: ShipToCustomer")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}

	async getProfileDetails(req, res, next) {
		try {
			console.log('*******View Profile Details *******')

			let orgName = req.body.orgName;
			let user = req.body.userId;

			console.log("orgname 	:", orgName)
			console.log("user 		:", user)

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, user, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log('----------Getting User Profile details------------\n')
			let result = await contract.evaluateTransaction('ViewProfileDetails');
			result = JSON.parse(result)
			console.log("Result :", result)
			return res.status(200).send({
				success: true,
				responseMsg: "Profile Details Found Successfully",
				profiledetail: result
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: ViewProfileDetails")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}

	async updateProfile(req, res, next) {
		try {
			console.log(`*******Update Profile Details *******`)

			let orgName = req.body.orgName
			let user = req.body.userId;
			let updateDef = req.body.data;

			console.log("orgname 		:", orgName)
			console.log("user  			:", user)
			console.log("updateDef 		:", updateDef)
			console.log("JSON.stringify(updateDef) : ", JSON.stringify(updateDef))

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, user, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log(`----------Update Profile details------------\n`, updateDef)
			let stateTxn = contract.createTransaction('UpdateProfile');
			await stateTxn.submit(JSON.stringify(updateDef));
			console.log('*** Profile Details Updated: committed');
			return res.status(200).send({
				success: true,
				responseMsg: `Profile Details Added Successfully`
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: UpdateProfile")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}

	async updateAdminStatus(req, res, next) {
		try {
			console.log(`******* Update Admin Account Status *******`)

			let orgName = req.body.orgName
			let user = req.body.userId;
			let updateDef = req.body.data;

			console.log("orgname 		:", orgName)
			console.log("user  			:", user)
			console.log("updateDef 		:", updateDef)
			console.log("JSON.stringify(updateDef) : ", JSON.stringify(updateDef))

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, user, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log(`----------Update Admin Account Status------------\n`, updateDef)
			let stateTxn = contract.createTransaction('ChangeAdminStatus');
			await stateTxn.submit(JSON.stringify(updateDef));
			console.log('*** Admin Account Status Updated: committed');
			return res.status(200).send({
				success: true,
				responseMsg: `Admin Account Status Successfully`
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: ChangeAdminStatus")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}

	async updateEntityStatus(req, res, next) {
		try {
			console.log(`*******Update ${req.body.data.docType} Account Status *******`)

			let orgName = req.body.orgName
			let user = req.body.userId;
			let updateDef = req.body.data;
			let docType = req.body.data.docType

			console.log("orgname 		:", orgName)
			console.log("user  			:", user)
			console.log("updateDef 		:", updateDef)
			console.log("JSON.stringify(updateDef) : ", JSON.stringify(updateDef))

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, user, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log(`----------Update ${docType} Account Status------------\n`, updateDef)
			let stateTxn = contract.createTransaction('ChangeEntityStatus');
			await stateTxn.submit(JSON.stringify(updateDef));
			console.log(`*** ${docType} Account Status Updated: committed`);
			return res.status(200).send({
				success: true,
				responseMsg: `${docType} Account Status Successfully`
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: ChangeEntityStatus")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}
	async updateStatus(req, res, next) {
		try {
			console.log(`*******Update ${req.body.data.docType} Account Status *******`)

			let orgName = req.body.orgName
			let user = req.body.userId;
			let updateDef = req.body.data;
			let docType = req.body.data.docType

			console.log("orgname 		:", orgName)
			console.log("user  			:", user)
			console.log("updateDef 		:", updateDef)
			console.log("JSON.stringify(updateDef) : ", JSON.stringify(updateDef))

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, user, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log(`----------Update ${docType} Account Status------------\n`, updateDef)
			let stateTxn = contract.createTransaction('ChangeStatus');
			await stateTxn.submit(JSON.stringify(updateDef));
			console.log(`*** ${docType} Account Status Updated: committed`);
			return res.status(200).send({
				success: true,
				responseMsg: `${docType} Account Status Successfully`
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: ChangeEntityStatus")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}

	async viewProductsByManufacturer(req, res, next) {
		try {
			console.log('******* View Products Details *******')

			let orgName = req.body.orgName;
			let user = req.body.userId;

			console.log("orgname 	:", orgName)
			console.log("user 		:", user)

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, user, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log('----------Getting Products details------------\n')
			let result = await contract.evaluateTransaction('GetProductsByManufacturer');
			result = JSON.parse(result)
			console.log("Result :", result)
			let message
			if (Array.isArray(result) && result.length === 0) {
				message = "No Products Details Found"
			}
			else{
				message = "Products Details Found Successfully"
			}

			return res.status(200).send({
				success: true,
				responseMsg: message,
				productsdetail: result
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: GetProductsByManufacturer")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}

	async viewAssetsByEntity(req, res, next) {
		try {
			console.log('******* View Asset Details *******')

			let orgName = req.body.orgName;
			let user = req.body.userId;

			console.log("orgname 	:", orgName)
			console.log("user 		:", user)

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, user, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log('----------Getting Asset details------------\n')
			let result = await contract.evaluateTransaction('GetAssetByEntity');
			result = JSON.parse(result)
			console.log("Result :", result)
			let message
			if (Array.isArray(result) && result.length === 0) {
				message = "No Asset Details Found"
			}
			else{
				message = "Asset Details Found Successfully"
			}

			return res.status(200).send({
				success: true,
				responseMsg: message,
				assetdetails: result
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: GetAssetByEntity")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}

	async trackPacket(req, res, next) {
		try {
			console.log('******* Track Asset Details *******')

			let orgName = req.body.orgName;
			let user = req.body.userId;
			let packetId = req.query.packetId;

			console.log("orgname 	:", orgName)
			console.log("user 		:", user)
			console.log("packetId 		:", packetId)

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, user, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log('----------Tracking Asset details------------\n')
			let result = await contract.evaluateTransaction('TrackPacket',packetId);
			console.log("Array.isArray(result) :", Array.isArray(result))
			console.log("result.length :", result.length)

			let message
			if (result.length === 0) {
				message = "No Asset Details Found"
				result =[]
			}
			else{
				message = "Asset Details Found Successfully"
				result = JSON.parse(result)
			}

			console.log("Result :", result)

			return res.status(200).send({
				success: true,
				responseMsg: message,
				packetHistory: result
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: TrackPacket")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}

	async viewReceipt(req, res, next) {
		try {
			console.log('******* View Receipt Details *******')

			let orgName = req.body.orgName;
			let user = req.body.userId;
			let receiptId = req.query.receiptId;

			console.log("orgname 	:", orgName)
			console.log("user 		:", user)
			console.log("receiptId 		:", receiptId)

			const gateway = new Gateway();
			let contract = await getContractObject(orgName, user, NETWORK_PARAMETERS.CHANNEL_NAME, NETWORK_PARAMETERS.CHAINCODE_NAME, gateway)
			console.log('----------Receipt details------------\n')
			let result = await contract.evaluateTransaction('ViewReceipt',receiptId);
			let message
			if (result.length === 0) {
				message = "No Receipt Details Found"
				result =[]
			}
			else{
				message = "Receipt Details Found Successfully"
				result = JSON.parse(result)
			}

			
			console.log("Result :", result)

			return res.status(200).send({
				success: true,
				responseMsg: message,
				receiptDetails: result
			});
		} catch (error) {
			console.log("Inside Catch block")
			console.log("Error Message :", error.message, ", method: ViewReceipt")
			return res.status(500).send({
				success: false,
				responseMsg: error.message
			});
		}
	}
}

module.exports = VaccineChainController;
