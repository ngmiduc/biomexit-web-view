console.log("running PRINTER server")
var fs = require("fs")

//var Printer = require('node-printer');
//console.log(Printer.list());

// Create a new Pinter from available devices
//var printer = new Printer('Epson-TM-BA-Thermal');

// Print from a buffer, file path or text
//var fileBuffer = fs.readFileSync('favicon.ico');
//var jobFromBuffer = printer.printBuffer(fileBuffer);

//var filePath = 'package.json';
//var jobFromFile = printer.printFile(filePath);

//var jobFromFile = printer.printFile('favicon.ico');

//var text = 'Print text directly, when needed: e.g. barcode printers'
//var jobFromText = printer.printText(text);

const admin = require("firebase-admin")

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "biomexit",
    private_key_id: "6e9037530dc9f70a796d6a910eb98572aade66b2",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDH/bqmDbsr0emg\ntaHqP0fSiUHoIQSphjZa5JAs5gfvHGw/S7iobVuuMcA0lMS4sjCu4wDRq5gtAKlP\nOZuR5dRDmdFzv2i4rZBSK4nNUJK01ntyaJqnVz36lntTII9rk9AJMCmk8VHeSAxu\n7WB5InVsk3pChg4Rv7hHKDNAN8LXfwVO3Ecob1rxiPx89VRDyF7E0PoHINKAyQJD\nCm91JkIVTabdZzC7Q/2dr8QBcVw2ETyTLgF0MAJYQQ9tieKe3wE7RdGTOVqZDk+j\nvpK/S2/l7UKGhaMEd+cFL0zQ1UoZYnWrZ+ug0/PLYQrxvlFOb4Y1OuW55Hx2gpUj\ngPO8Zk0DAgMBAAECggEAGGh0o7iQS/BSGa2hRcQUYXMkCo8hEQmSz7QOjpRCiqHG\n6lC1CEVUh6WFxkUT31DMFUQaQPy21WM7xrIKtRs+NUPsJrrJLqTsNMMgjeDUDuMQ\nbO2sVlkU9OTxxzr1lhUTslNg+cMEEWNstQsel5onh6lWJhFTXUIvXOvgmWlUy9T7\nFy+dKOPXcuSswJSO4GiU8RKVyDMGRUjj6x0zKSNl2si9qUps486e/0yDS25dZsfF\nRAEsTYDVKvJ888pSXZLetwVfIcDU2PWHdMIr/diF/M4++QbuOThxyPbqW+rduVfW\nmqgGQAE3nWJxGyQYp8qMFIpEl70BMe/9CL2fnQ92MQKBgQDig1WFH4Y6OR3RuXD2\njJ1YNvbP/BfWw1VvzfyAKOCDDrCkOlOvde/DLDsiVqvatWpqFAlYztw2Iq9Js094\n4GNm21w4j/Ejh0PDUBYPsESWInYXyC0H4ysrQFzaYyd4SEOrTgTzQnzAX2Ej8E3F\nzNZT8bStqhqyrmE1tMJR3NoxswKBgQDiBon2pw1hOJES0Kldy+zf7xXoeD7qGEeC\nY90Ja4ZBKApgZcgsTa6myTtSX76Mx673X/B2kRhfggbagaYXnrmveFinVN3XBrR/\nrNrZcTyYE6IP5dQgB7i4txXG+kYt/MpcP5GjT8do+wxy8v+aL0Gp/tQJjodk1jDt\nuVRghu+vcQKBgQDAgqRlTsSSqUZpnzSdpiZ3+cbMP1G3ai4rpqKp/ZPKbuq7uQK0\nxgQvGWFsrsLCT5sQatUC0FSiAdp+RdIORo7UtSxsuhFUg7qYvXDyhnnUK5e4YJ28\n7VocGUiRJuI9vRUd+2IDqQdDrAxwMeS3bn7duzg2vLKSF9hwf58DWjNrNwKBgB19\nquyi2U0RG2SwExko7Ww+fsZJQjQ7HMF3lDSRcf/4YHo5bYfSTvJ2GSZjVbJ6r2qZ\nev+NaPe1OH20It68GBA8DJ0wpo1S06RBAoESlExna2LVovrW5xQ61z2SFCwV6rVk\nmfUMCMG61+H7sLwGZHPwyuvATAwtIk8yOj8p/AYRAoGAcoT7WKVfltZIn+hKJqit\nlQ8i6u9eNcrPDm/k9EaNbaeCzctnQuBM9G6n8cEGf3UJ1He1knE+IYtAFGKZjUfC\neIU8b2BqydThkwste6RpH7GzUWZLge/NdfZgWbAEsXhIum9mqJobCj1M6eYMTYjB\n3/Yk+USf0YBIrKH8/MdFWrg=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-8fcjo@biomexit.iam.gserviceaccount.com",
    client_id: "105004017817205676620",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8fcjo%40biomexit.iam.gserviceaccount.com"
  }), // Or credential
  storageBucket: "biomexit.appspot.com"
})

var bucket = admin.storage().bucket()
var firestore = admin.firestore()

var usb = require("usb")
const list = usb.getDeviceList()
let pid = null
let vid = null

list.forEach(d => {
  if (
    d.deviceDescriptor.bcdDevice == 256 &&
    d.deviceDescriptor.bMaxPacketSize0 == 64
  ) {
    vid = d.deviceDescriptor.idVendor
    pid = d.deviceDescriptor.idProduct
    console.log("get VID and PID", { vid, pid })
  }
})

console.log("LOGGED IN")

const escpos = require("escpos")
let device = new escpos.USB(vid, pid) //'0x04b8','0x0202'
const options = { encoding: "GB18030" /* default */ }
const printer2 = new escpos.Printer(device, options)
const bodyParser = require("body-parser")
const express = require("express")
const app = express()

console.log("device : ", device)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.use(bodyParser.json())

firestore
  .collection("faces")
  .orderBy("date", "desc")
  .limit(1)
  .onSnapshot(querySnapshot => {
    // console.log("get DATA")
    let tmp = []
    querySnapshot.forEach(doc => {
      tmp.push({ id: doc.id, data: doc.data(), meta: doc.metadata })
    })

    let item = {
      url: tmp[0].data.url,
      id: tmp[0].id,
      analysis: tmp[0].data.analysis
    }

    console.log("GET new data from tracking ...")

    let today = new Date()
    today.setTime(today.getTime() + 1 * 86400000)
    today = today.toISOString()
    today = today.split("T")[0]
    console.log("timedate: ", today)

    device.open(async function() {
      let state = [
        "single",
        "married",
        "divorced",
        "celibate",
        "unknown",
        "open",
        "widow",
        "role"
      ]
      let age = Math.floor(Math.random(1) * 30 + 20)
      let rating = Math.floor(Math.random(1) * 1000000)
      let barcode = Math.floor(Math.random() * 899999999999 + 100000000000)
      console.log("code: ", barcode)
      await printer2
        .font("a")
        .align("ct")
        .style("bu")
        .size(1, 1)
        .text("")
        .text("TIME " + today)
        .text("ID " + item.id)
        .text("ANALYSIS " + item.analysis)
        .text("STATE " + state[Math.floor(Math.random() * 8)])
        .text("RATING " + rating)
        .text("AGE: " + age)
        .barcode("" + barcode, "EAN13")

      await printer2.close()
    })
  })

let busy = false
app.post("/", async function(req, res) {
  if (!busy) {
    busy = true
    console.log("get request from network")

    console.log(req.body)

    //let file = bucket.file('faces/'+req.body.image+'.jpg')
    let today = new Date()
    today.setTime(today.getTime() + 1 * 86400000)
    today = today.toISOString()
    today = today.split("T")[0]
    console.log("today", today)

    //let signedUrls = await file.getSignedUrl({
    //action: 'read',
    //expires: today
    //})

    //.then(signedUrls => {
    // signedUrls[0] contains the file's public URL
    //});

    //signedUrls = signedUrls[0]

    //console.log("signed URLS", signedUrls)

    //let tux = "https://wiki.ubc.ca/images/4/41/Every_Icon.png"
    //  let tux = signedUrls

    //var base64Img = require('base64-img');

    //base64Img.requestBase64("https://firebasestorage.googleapis.com/v0/b/biomexit.appspot.com/o/faces%2FtOGjxf5MQBe6KKaQYtoR.jpg?alt=media&token=f0a57335-abea-4a69-9374-9a644d264300", function(err, res, body) {
    //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."

    //console.log("body", body)

    //escpos.Image.load(body, function(image){

    device.open(async function() {
      let state = [
        "single",
        "married",
        "divorced",
        "celibate",
        "unknown",
        "open",
        "widow",
        "role"
      ]
      let age = Math.floor(Math.random(1) * 30 + 20)
      let rating = Math.floor(Math.random(1) * 1000000)
      let barcode = Math.floor(Math.random() * 899999999999 + 100000000000)
      console.log("code", barcode)
      await printer2
        .font("a")
        .align("ct")
        .style("bu")
        .size(1, 1)
        .text("")
        .text("TIME " + today)
        .text("ID " + req.body.id)
        .text("ANALYSIS " + req.body.analysis)
        .text("STATE " + state[Math.floor(Math.random() * 8)])
        .text("RATING " + rating)
        .text("AGE: " + age)
        .barcode("" + barcode, "EAN13")

      /*await printer2.image(image, 's8')
	await printer2.image(image, 'd8')
	await printer2.image(image, 's24')
	await printer2.image(image, 'd24')

	await printer2.raster(image)
	await printer2.raster(image, 'dw')
	await printer2.raster(image, 'dh')
	await printer2.raster(image, 'dwdh')
*/
      //.cut()
      await printer2.close()
    })

    busy = false
    //});

    //});
  }
  res.send("ok")
})

app.listen(3000, "0.0.0.0", function() {
  console.log("Listening to port:  " + 3000)
})
