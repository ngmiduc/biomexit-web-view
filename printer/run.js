console.log("[printer] start local NODEjs server")
console.log("[printer] PRINTER server is starting")

const admin = require("firebase-admin")
const usb = require("usb")
const escpos = require("escpos")

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

console.log("[printer] init database")
// var bucket = admin.storage().bucket()
var firestore = admin.firestore()

const list = usb.getDeviceList()
console.log("[printer] get USB device list")
let pid = null
let vid = null

list.forEach(d => {
  console.log("[printer] get device")
  if (
    d.deviceDescriptor.bcdDevice == 256 &&
    d.deviceDescriptor.bMaxPacketSize0 == 64
  ) {
    console.log("[printer] found printer")
    vid = d.deviceDescriptor.idVendor
    pid = d.deviceDescriptor.idProduct
    console.log("[printer] get VID and PID", { vid, pid })
  }
})

const device = new escpos.USB(vid, pid) //'0x04b8','0x0202'
const options = { encoding: "GB18030" /* default */ }
const printer = new escpos.Printer(device, options)

console.log("[printer] device : ", device)

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
    console.log("")
    console.log("[get data] GET new data from tracking ...")

    let today = new Date()
    today.setTime(today.getTime() + 1 * 86400000)
    today = today.toISOString()
    today = today.split("T")[0]
    console.log("[get data] timedate: ", today)

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

      console.log("[get data] meta information: ", { age, rating })
      console.log("[get data] code: ", barcode)

      for (var i = 0; i < 10; i++) {
        console.log(
          "[fetching ...] " +
            Math.floor(Math.random() * 899999999999 + 100000000000)
        )
      }

      await printer.font("a")
      await printer.align("ct")
      await printer.style("bu")
      await printer.size(1, 1)
      await printer.text("")
      await printer.text("TIME " + today)
      await printer.text("ID " + item.id)
      await printer.text("ANALYSIS " + item.analysis)
      await printer.text("STATE " + state[Math.floor(Math.random() * 8)])
      await printer.text("RATING " + rating)
      await printer.text("AGE: " + age)
      await printer.barcode("" + barcode, "EAN13")
      await printer.close()
    })
  })
