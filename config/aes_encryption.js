const crypto      = require('crypto'),
      cipher_seed = 'some_random_characters';

const encrypt = function(text) {
    var cipher  = crypto.createCipher('aes-256-cbc', cipher_seed),
        crypted = cipher.update(text, 'utf8', 'hex');

    crypted += cipher.final('hex');

    return crypted;
};

const decrypt = function(text) {
    var decipher  = crypto.createDecipher('aes-256-cbc', cipher_seed),
        decrypted = decipher.update(text, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
};

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;