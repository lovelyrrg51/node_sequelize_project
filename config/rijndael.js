var base64 = require('base64-js');
var mcrypt = require('js-rijndael');

var key = [0x5d,0xe5,0xc8,0x0d,0xca,0xf7,0xa0,0x2d,0x52,0xb5,0x26,0x31,0x86,0x34,0xcc,0xa8];
var iv = [0x57,0x72,0x32,0x6a,0x59,0x4b,0x46,0x63,0x4d,0x67,0x42,0x66,0x33,0x4e,0x4a,0x76];

function getBytes(stringValue) {
  var myBuffer = [];

  var buffer = new Buffer(stringValue);
  for (var i = 0; i < buffer.length; i++) {
      myBuffer.push(buffer[i]);
  }

  return myBuffer;
}

function encrypt(plaintext){
  var message = getBytes(plaintext);
  var clearText = Buffer.from(mcrypt.encrypt(message, iv, key, 'rijndael-128', 'cbc')).toString("base64");
 
  return clearText;
}

function decrypt(plaintext){
  var message = [].slice.call(base64.toByteArray(plaintext));
  var clearText = String.fromCharCode.apply(this, mcrypt.decrypt(message, iv, key, 'rijndael-128', 'cbc'));
  
  return clearText;
}


exports.decrypt = decrypt;
exports.encrypt = encrypt;
