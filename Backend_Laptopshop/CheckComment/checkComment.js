const { spawn } = require("child_process");
const path = require("path");
async function predictSentiment(sentence) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [
      path.join(__dirname, "..", "CheckComment", "sentiment_analysis.py"),
      JSON.stringify({ sentence: sentence }),
    ]);

    pythonProcess.stdout.on("data", (data) => {
      let result = data.toString();
      resolve(result);
    });

    pythonProcess.stderr.on("data", (data) => {
      reject(data.toString());
    });
  });
}
module.exports = {
  predictSentiment,
};
