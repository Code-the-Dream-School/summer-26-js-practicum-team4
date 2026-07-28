const {
  generatePatternImage,
} = require("../services/pattern-generator.service");

async function generatePattern(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image using the image field.",
      });
    }

    const requestedWidth = Number(req.body.width) || 50;
    const requestedHeight = Number(req.body.height) || 50;

    if (
      requestedWidth < 10 ||
      requestedWidth > 200 ||
      requestedHeight < 10 ||
      requestedHeight > 200
    ) {
      return res.status(400).json({
        message: "Pattern width and height must be between 10 and 200.",
      });
    }

    const pattern = await generatePatternImage(req.file.buffer, {
      width: requestedWidth,
      height: requestedHeight,
    });

    res.set("Content-Type", "image/png");
    res.set("Content-Disposition", 'inline; filename="generated-pattern.png"');

    return res.status(200).send(pattern.buffer);
  } catch (error) {
    console.error("Pattern generation error:", error);

    return res.status(500).json({
      message: "Unable to generate the pattern.",
    });
  }
}

function getAllUserPatterns(req, res) {
  return res.send({
    message: "Behold all of your patterns... yeah we can't do that yet",
  });
}

module.exports = {
  generatePattern,
  getAllUserPatterns,
};
