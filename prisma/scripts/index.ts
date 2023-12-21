// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = require('child_process').exec;

function execute(command, callback) {
  exec(command, function (error, stdout, stderr) {
    callback({ error, stdout, stderr });
  });
}

function sortLines(content) {
  return content.split('\n').sort().join('\n').trim();
}

module.exports = {
  execute,
  sortLines,
};
