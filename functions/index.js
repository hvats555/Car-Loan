const functions = require("firebase-functions");
const _ = require('lodash');
const cors = require("cors")({origin: true});
const cors2 = require('cors');
const express = require("express")
const admin = require('firebase-admin');
const csv=require('csvtojson')
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(cors2());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

admin.initializeApp()
const db = admin.firestore();

const upload_carsInventory = (collection, jsonobjs)=>{

    jsonobjs.forEach(async (element) => {
        await db.collection(collection).add(element);
    });

    console.log(`Upload completed in ${collection}`);
}

const upload_vehicalBookingGuide = async (collection, jsonobjs, bankId) => {
    console.log(collection);
    console.log(bankId);

    const bankRef = db.collection(collection).doc(bankId);
    const res = await bankRef.update({vehicalBookingGuide: jsonobjs});

    console.log(`Upload completed in ${collection} for bank ${bankId}`);
}

exports.upload = functions.https.onRequest((req, res) => {
    cors(req , res , () => {
        if (req.method === 'POST') {
            const busboy = new Busboy({ headers: req.headers });
            const uploads = {}
    
            // This callback will be invoked for each file uploaded
            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {                
                console.log(`File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);

                const filepath = path.join(os.tmpdir(), fieldname+'.csv');
                uploads[fieldname] = { file: filepath }

                console.log(`Saving '${fieldname}' to ${filepath}`);
                file.pipe(fs.createWriteStream(filepath));
            });
    
            // This callback will be invoked after all uploaded files are saved.
            busboy.on('finish', () => {
                for (const name in uploads) {
                    const upload = uploads[name];
                    const file = upload.file;
                    csv()
                .fromFile(file)
                .then((jsonObj)=>{
                    if(req.headers['x-upload-collection'] === 'banks') {
                        upload_vehicalBookingGuide(req.headers['x-upload-collection'], jsonObj, req.headers['x-bankid']);
                    } else if (req.headers['x-upload-collection'] === 'carsInventory') {
                        upload_carsInventory(req.headers['x-upload-collection'], jsonObj);
                    }
                    // fs.unlinkSync(file);
                })
                    res.write(`${file}\n`);   
                }
                res.end();
            });
            busboy.end(req.rawBody);
        } else {
            res.status(405).end();
        }
    })
});

function emiCalculator(loanAmount, interestRate, loanDuration){         
    var interestPerYear = (loanAmount * interestRate)/100; 
    var monthlyInterest = interestPerYear/12;
    
    var monthlyPayment = monthlyInterest + (loanAmount/loanDuration);
    // var totalInterestCost = monthlyInterest * loanDuration;
    // var totalRepayment = monthlyPayment * loanDuration;
    return monthlyPayment;  
}

const purgeSelectedCars = async (customerId, bankId) => {
    const selectedCarsQuery = db.collection('selectedCars').where('customer', '==', customerId).where('bank', '==', bankId);

    const selectedCarsSnapshot = await selectedCarsQuery.get();

    if(selectedCarsSnapshot.empty) {
        console.log('Found no cars to purge, continuing...');
        return;
    } else {
        console.log(`Found ${selectedCarsSnapshot.size} to purge...`);

        selectedCarsSnapshot.forEach((selectedCar) => {
            console.log(`Purging ${selectedCar.id}`)
            selectedCar.ref.delete();
        });
    }
}

app.post('/cars/search', async (req, res) => {
    const {bankId, customerId, profitAmount} = req.body;

    // purgeSelectedCars(customerId, bankId);
    purgeSelectedCars(customerId, bankId);

    console.log("Bank id", bankId);
    console.log("Customer id", customerId);
    console.log("profitAmount", profitAmount);

    let approvedBank = {};

    const customerRef = db.collection('customers').doc(customerId);
    const customer = await customerRef.get();
    const approvedBanks = customer.data().approvedBanks;


    for(let i=0; i<approvedBanks.length; i++) {
        if(approvedBanks[i].bankId == bankId) {
            approvedBank = approvedBanks[i];
            break;
        }
    }
    console.log(approvedBank);

    const carsInventoryRef = db.collection('carsInventory');
    const snapshot = await carsInventoryRef.get();

    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }  

    snapshot.forEach(async doc => {  
        let car = {
            price: parseInt(doc.data().cost) + profitAmount,
            mileage: parseInt(doc.data().mileage),
            year: parseInt(doc.data().year)
        }
        
        const bankRef = db.collection('banks').doc(bankId);
        const bank = await bankRef.get();
        const vehicalBookingGuide = bank.data().vehicalBookingGuide;
        let carStatus = {};

        for(let i=0; i<vehicalBookingGuide.length; i++) {
            if(parseInt(vehicalBookingGuide[i].year) == car.year) {
                if(car.mileage > vehicalBookingGuide[i].minMileage && car.mileage < vehicalBookingGuide[i].maxMileage) {
                    carStatus = vehicalBookingGuide[i];
                    break;
                }
            }
        }

        const emi = emiCalculator(car.price, parseInt(approvedBank.interestRate), parseInt(carStatus.maxTerm));

        if(Math.round(emi) <= Math.round(parseInt(approvedBank.monthlyEmi))) {
            console.log(`Adding ${doc.name}`);
            await db.collection('selectedCars').add({
                car: doc.id,
                customer: customerId,
                bank: bankId
            });
        }     
    });

    res.send("ok");
});

exports.carSearch = functions.https.onRequest(app);
