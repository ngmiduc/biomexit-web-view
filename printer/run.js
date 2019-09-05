console.log("[printer] start local NODEjs server")
console.log("[printer] PRINTER server is starting")

const path = require("path")
const admin = require("firebase-admin")
const usb = require("usb")
const escpos = require("escpos")

const http = require("https")
const fs = require("fs")

const cerd = require("./cred.json")

admin.initializeApp({
  credential: admin.credential.cert(cerd),
  storageBucket: "biomexit.appspot.com"
})

console.log("[printer] init database")
var bucket = admin.storage().bucket()
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

let BUSY = false

firestore
  .collection("faces")
  .orderBy("date", "desc")
  .limit(1)
  .onSnapshot(querySnapshot => {
    console.log("")
    console.log("[detecting new data ...]")
    console.log("")

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

    //add bucket get image  OPTIONAL
    // e.g.: URL is https://firebasestorage.googleapis.com/v0/b/biomexit.appspot.com/o/faces%2F583.jpg?alt=media&token=b662d5ec-259c-4851-8d50-4bea52dfcb1a
    let fileName = item.url.split("iomexit.appspot.com/o/faces%2")[1]
    fileName = fileName.split(".jpg")[0]
    fileName = "faces/" + fileName + ".jpg"
    const file = bucket.file(fileName)
    return file
      .getSignedUrl({
        action: "read",
        expires: "03-09-2491"
      })
      .then(signedUrls => {
        // signedUrls[0] contains the file's public URL

        const sURL = signedUrls[0]

        fs.unlink("file.jpg", function(err) {
          if (err) throw err
          // if no error, file has been deleted successfully
          console.log("File deleted!")

          const file = fs.createWriteStream("file.jpg")
          const request = http.get(sURL, function(response) {
            var stream = response.pipe(file)
            stream.on("finish", function() {
              //end bucket get image

              let today = new Date()
              today.setTime(today.getTime() + 1 * 86400000)
              today = today.toISOString()
              today = today.split("T")[0]
              console.log("[get data] timedate: ", today)

              if (!BUSY) {
                BUSY = true

                const tux = path.join(__dirname, "file.jpg")
                escpos.Image.load(tux, function(image) {
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
                    let barcode = Math.floor(
                      Math.random() * 899999999999 + 100000000000
                    )

                    console.log("[get data] meta information: ", {
                      age,
                      rating
                    })
                    console.log("[get data] code: ", barcode)

                    for (var i = 0; i < 10; i++) {
                      console.log(
                        "[fetching ...] " +
                          Math.floor(
                            Math.random() * 899999999999 + 100000000000
                          )
                      )
                    }

                    await printer.font("a")
                    await printer.align("ct")
                    await printer.style("bu")
                    await printer.size(1, 1)
                    await printer.text("")
                    await printer.text("TIME " + today)
                    await printer.text("BIOMETRIC EXIT")
                    await printer.text("ID " + item.id)
                    await printer.text("ANALYSIS " + item.analysis)
                    await printer.text(
                      "STATE " + state[Math.floor(Math.random() * 8)]
                    )
                    await printer.text("RATING " + rating)
                    await printer.text("AGE: " + age)
                    await printer.barcode("" + barcode, "EAN13")

                    await printer.image(image, "s8")
                    await printer.close()
                  })
                })

                BUSY = false
              } else {
                console.log("[BLOCK DATA]")
                console.log("[BLOCK DATA]")
                console.log("[BLOCK DATA]")
              }
            })
          })
        })
      })
  })
