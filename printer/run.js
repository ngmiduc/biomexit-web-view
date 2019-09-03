console.log("running PRINTER server")

const ThermalPrinter = require("node-thermal-printer")

console.log(ThermalPrinter)

const electron =
  typeof process !== "undefined" &&
  process.versions &&
  !!process.versions.electron

let print = new ThermalPrinter({
  type: "epson", // Printer type: 'star' or 'epson'
  interface: "printer:EPSON TM-T20II", // Printer interface
  driver: require(electron ? "electron-printer" : "printer"),
  characterSet: "SLOVENIA", // Printer character set - default: SLOVENIA
  removeSpecialCharacters: false, // Removes special characters - default: false
  lineCharacter: "=", // Set character for lines - default: "-"
  options: {
    // Additional options
    timeout: 5000 // Connection timeout (ms) [applicable only for network printers] - default: 3000
  }
})

const run = async () => {
  let isConnected = await print.isPrinterConnected()
  console.log("connection : ", isConnected)

  return true
}

if (run) {
  console.log("run function excecuted")
}
