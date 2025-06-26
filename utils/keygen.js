// Salve este código em um arquivo, por exemplo, generateKeys.js, e execute com Node.js
const crypto = require('crypto');

// Gera um par de chaves (pública e privada)
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, // Tamanho da chave em bits
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

console.log('Public Key:', publicKey);
console.log('Private Key:', privateKey);