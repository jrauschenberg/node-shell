  var fs = require("fs");
  var request = require('request');
  var chalk = require('chalk');

  var commandPwd = {

    pwd: function(stdin, file, done) {
      var result = process.cwd();
      done(result);
    },

    date: function(stdin, file, done) {
        var now = (new Date()).toString();
        done(now);
    },

    ls: function (stdin, file, done) {
        fs.readdir(".", function (error, files) {
          if (error) {throw error};
          var result = "";
          files.forEach(function (file) {
            result += file.toString() + "\n";
          })
          done(result); 
        });
    },

    echo: function(stdin, file, done) {
        var input = stdin || file;

        if (input[0] === "$") {
          if (input.slice(1) in process.env) {
            done(process.env[input.slice(1)]);
          } else {
            done("That env does not exist");
          }
        } else {
          done(input);
        }
    },

    cat: function (stdin, file, done) {
        var input = stdin || file;
        fs.readFile (input, 'utf8', function(error, data) {
          if (error) { throw error };
          done(data);
        });
    },

    head: function (stdin, file, done) {
      var input = stdin || file;
      
      var headHelper = function (str) {
        var result = "";
        var temparr = str.split("\n");
        for (i=0; i<5; i++) {
          result += (temparr[i] + "\n");
        }
        done(result);
      }

      if (file) {
        fs.readFile(input, 'utf8', function(error, data) {
          if (error) throw error;
          headHelper(data);
      })} else {
          headHelper (stdin);
        }
    },

    tail: function (stdin, file, done) {
      var input = stdin || file;

      var tailHelper = function (str) {
        var result = "";
        var temparr = str.split("\n");
        for (i=temparr.length-5; i<temparr.length; i++) {
          result += (temparr[i] + "\n");
        }
        done(result);
      }

      if (file) {
        fs.readFile(input, 'utf8', function(error, data) {
          if (error) throw error;
          tailHelper(data);
      })} else {
          tailHelper (stdin);
        }    
    },

    wc: function (stdin, file, done) {
      var input = stdin || file;

      var wcHelper = function (str) {
        var temparr = str.split("\n");
        done((temparr.length).toString());
      }

      if (file) {
        fs.readFile(file, 'utf8', function(error, data) {
          if (error) throw error;
          var temparr = data.split("\n");
          done((temparr.length).toString());
        })
      } else {
        wcHelper(stdin);
      }
    },

    curl: function(stdin, url, done) {
      request(url, function(error, response, body) {
        if (error) process.stdout.write("That is not a valid URL");
        else if (response.statusCode == 200) {
          done(body);
        }
      });
    },

    grep: function (stdin, str, done) {
      var strArr = stdin.split("\n");
      var newarr = [];
      for (var i=0; i<strArr.length; i++) {
        if (strArr[i].indexOf(str) !== -1) {
          newarr.push(strArr[i]);
        }
      }
      if (newarr) {
        newarr = newarr.join("\n");
        newarr = newarr.replace(/function/g, chalk.blue("function"));
        done(newarr);
      } else {
        done('No matches found.');
      }
    }
  }

  module.exports = commandPwd;