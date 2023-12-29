const contractListener = async (event) => {
    const shipmentAlert = JSON.parse(event.payload.toString());
    console.log(`!!!!!!!!!!!!!!!!!! A.L.E.R.T !!!!!!!!!!!!!!!!!!`)
    console.log(`Shipment Event Received: ${event.eventName}`);
    console.log(`${JSON.stringify(shipmentAlert)}`);
    const eventTransaction = event.getTransactionEvent();
    console.log(`*** transaction: ${eventTransaction.transactionId} status:${eventTransaction.status}`);
    const eventBlock = eventTransaction.getBlockEvent();
    console.log(`*** block: ${eventBlock.blockNumber.toString()}`);
    console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
};


const blockListener = async (event) => {

    console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
    console.log(`Block Event Received - block number: ${event.blockNumber.toString()}`);
    const transEvents = event.getTransactionEvents();
    for (const transEvent of transEvents) {
        console.log(`*** transaction event: ${transEvent.transactionId} status:${transEvent.status}`);
        if (transEvent.transactionData) {
            showTransactionData(transEvent.transactionData);
        }
    }
};

function showTransactionData(transactionData) {
	const chaincode = transactionData.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec;
	console.log(`    - chaincode:${chaincode.chaincode_id.name}`);
	console.log(`    - function:${chaincode.input.args[0].toString()}`);
	for (let x = 1; x < chaincode.input.args.length; x++) {
		console.log(`    - arg:${chaincode.input.args[x].toString()}`);
	}
}

module.exports = {
    contractListener,
    blockListener
}