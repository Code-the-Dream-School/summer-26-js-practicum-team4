const fs = require("node:fs");
const sharp = require("sharp");
const { generatePattern } = require("./pattern-pipeline.service");

const input = "./41-417507_soap-png-soap-png.png";

async function processData() {
  const imgBuff = await sharp(input).png().toBuffer();

  const patObj = await generatePattern(imgBuff, { width: 50 });

  const patObjJson = JSON.stringify(patObj);

  fs.writeFile("./soapPat.JSON", patObjJson, (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });
  return;
}

processData();
