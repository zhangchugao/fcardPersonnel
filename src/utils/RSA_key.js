const JSEncrypt = require('./jsencrypt.js');
// 生成秘钥对
// 返回数组 array[0]公钥  array[1]私钥
export function generateKeys(){
  var crypt = new JSEncrypt.JSEncrypt({ default_key_size: 2048 });
  crypt.getKey();
  var publicKey = crypt.getPublicKey();
  var privateKey = crypt.getPrivateKey();

  // 去除-----*** RSA **** KEY----- 和空格换行
  // publicKey = (publicKey.split('-----'))[2];
  // publicKey = publicKey.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "").replace(/\s*/g, "");
  // privateKey = (privateKey.split('-----'))[2];
  // privateKey = privateKey.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "").replace(/\s*/g, "");

  // 返回生成的秘钥对
  return [publicKey, privateKey];
}