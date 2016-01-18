var commandPwd = require('./commands.js');
var argArray = [];

var done = function (output) {
  if (argArray.length) {
    var cmd = argArray[0];
    cmd = cmd.split(" ");
    argArray = argArray.slice(1);
    commandPwd[cmd[0]](output, cmd[1], done);
  } else {
    process.stdout.write(output);
    process.stdout.write("\nprompt > ");
  }
}

process.stdout.write('prompt > ')

process.stdin.on('data', function(data) {
  var input = data.toString().trim();
  if (input.indexOf("|") !== -1) {
    var pipeArray = input.split(/\s*\|\s*/g);

    // for (var i=0; i<pipeArray.length; i++) {
    //   argArray = argArray.concat(pipeArray[i].split(" "));
    // }
    argArray = argArray.concat(pipeArray[0].split(" "));
    argArray = argArray.concat(pipeArray.slice(1));

  } else {
    argArray = input.split(" ");
  }

  var cmd = argArray[0];
  var file = argArray[1];
  argArray = argArray.slice(2);
  if (commandPwd[cmd]) {
    commandPwd[cmd](null, file, done);
  } else {
    process.stdout.write("Not a valid command.");
    process.stdout.write("\nprompt > ");
  }
})

