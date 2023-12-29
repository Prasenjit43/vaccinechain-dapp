const express = require("express");
const router = express.Router();
const VACCINECHAINController = require("../src/handlers/vaccinechain-controller");
const vaccinechainController = new VACCINECHAINController();

router.post("/addAdmin", vaccinechainController.addAdmin);
router.post("/addManufacturer", vaccinechainController.addEntity);
router.post("/addDistributer", vaccinechainController.addEntity);
router.post("/addChemist", vaccinechainController.addEntity);
router.post("/addProduct", vaccinechainController.addProduct);
router.post("/createBatch", vaccinechainController.createBatch);
router.post("/supplyToDistributer", vaccinechainController.supplyToDistributer);
router.post("/supplyToChemist", vaccinechainController.supplyToChemist);
router.post("/sellToCustomer", vaccinechainController.sellToCustomer);

router.get("/viewProfile", vaccinechainController.getProfileDetails);
router.get("/viewProductsByManufacturer", vaccinechainController.viewProductsByManufacturer);
router.get("/viewAssetsByEntity", vaccinechainController.viewAssetsByEntity);
router.get("/trackPacket", vaccinechainController.trackPacket);
router.get("/viewReceipt", vaccinechainController.viewReceipt);

router.put("/updateProfile", vaccinechainController.updateProfile);
router.put("/updateAdminStatus", vaccinechainController.updateAdminStatus);
router.put("/updateEntityStatus", vaccinechainController.updateEntityStatus);

module.exports = router;
