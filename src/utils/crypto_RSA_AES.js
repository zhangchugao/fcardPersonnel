// crypto-js aes
/**
 * aes 加密
 * https://www.jianshu.com/p/a47477e8126a
 * 附件1  JS和WEB服务器的敏感信息交换加密算法和秘钥：
    算法采用：AES 128bit，CBC
    秘钥的Base64：NDdhMjhkZWMwMGMxNDljNmI1ZjdhOWE4NjhkM2UxMjk=
    IV的Base64：YmQwZmJiNGY4YjEwYjg4Mg==
    敏感数据明文格式，使用|分割，时间戳时间格式：yyyyMMddHHmmss
    格式：时间戳|敏感数据
    示例：20200327143015|12345678
    在线混绕网站 https://obfuscator.io/
 */


// import { sha256 } from 'js-sha256';
import JSEncrypt from './jsencrypt'
import CryptoJS from 'crypto-js'
// const JSEncrypt = require('./jsencrypt.js');
// let asdfas = new JSEncrypt
// console.error(new JSEncrypt())
let publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArfOzx+LjKF+BZKcbriPu
rWwmlrif+fQvZyqQq6hG8SWZRE52Ahp++3Fem79XdAu3U5jumvOeEKAfXMCClsfV
G9EqhLNSVA7Xb8zgnVelSHMPg9r2LX73nPSK28r3SoHAAuVNrva8f94koCYV8zym
I6W3duhDL/bfQDUkFS3MJcUb8bQcaxupKPLkxImBYGAjI3ceSMi984CFCcS8D6yU
tWGnxqy/nZVrfws7eI72FSpa2JaWkp7Bqm27bAMnirMx27rRN9uatHLjGBS60yrO
kZ1UJDkffi9tyOEIaEbNvUJWMH9rSAqiMpWH9Qdo9Vre4heMwNaxcFheYfty/o8Q
aQIDAQAB
-----END PUBLIC KEY-----`

/**
 * RSA本地生成的私钥进行RSA加密
 * @param {使用自己成的公钥} key1 
 * @param {使用自己成的私钥} key2 
 */
export function RSA(key1,key2){
  // console.log(key1,key2)
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(key1);
  encrypt.setPrivateKey(key2);
  // encrypt = encrypt()
  return encrypt
}


/**
 * 使用固定的私钥加密
 */
export  function RSA_encrypt(){
  var encrypt1 = new JSEncrypt();
  encrypt1.setPublicKey(publicKey);
  return encrypt1
};
/**
 * SHA256加密
 * @param {加密的内容} message 
 */
export function SHA256(message){
  // console.log('*-*-*-**-*-*-*-*-*-*-*-*-*-*-*',CryptoJS.SHA3("Message", { outputLength: 256 }))
  // console.log(sha256('Message'))
  console.log(CryptoJS.SHA256('Message').toString(CryptoJS.enc.Hex))
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex)
}

/**
 * 
 * @param {回调函数，两个参数，分别是公钥和私钥} func 
 */
export function getRsaKeys(func) {
  console.log(window.crypto.subtle)
  window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 2048, //can be 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {
          name: "SHA-256"
        }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
    ).then(function (key) {
      window.crypto.subtle.exportKey(
          "pkcs8",
          key.privateKey
        ).then(function (keydata1) {
          window.crypto.subtle.exportKey(
            "spki",
            key.publicKey
          ).then(function (keydata2) {
            var privateKey = RSA2text(keydata1, 1);
            var publicKey = RSA2text(keydata2);
            func(privateKey, publicKey);
          }).catch(function (err) {
            console.error(err);
          });
        })
        .catch(function (err) {
          console.error(err);
        });
    })
    .catch(function (err) {
      console.error(err);
    });
}

function RSA2text(buffer, isPrivate = 0) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  var base64 = window.btoa(binary);
  var text = "-----BEGIN " + (isPrivate ? "PRIVATE" : "PUBLIC") + " KEY-----\n";
  text += base64.replace(/[^\x00-\xff]/g, "$&\x01").replace(/.{64}\x01?/g, "$&\n");
  text += "\n-----END " + (isPrivate ? "PRIVATE" : "PUBLIC") + " KEY-----";
  return text;
}

 


/**
 * 加密
 * @param {加密的内容} text 
 * @param {aes key} key 
 * @param { aes iv} iv
 */
export function Encrypt (text,key='47a28dec00c149c6b5f7a9a868d3e129',iv='bd0fbb4f8b10b882') {
  
  return CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    // padding: CryptoJS.pad.Pkcs7  //key32位不需要添加此一行代码
  }).toString()
}

/**
 * 解密
 * @param {密文，字符串} text 
 * @param {aes key} key 
 * @param { aes iv} iv 
 */
export function Decrypt (text,key='47a28dec00c149c6b5f7a9a868d3e129',iv='bd0fbb4f8b10b882') {
  // console.log(key,iv)
  let decrypted = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    // padding: CryptoJS.pad.Pkcs7  //32位不需要添加此一行代码
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}


/**
 * base64 密钥解密
 * @param {base64字符串} text 
 * @param {*} key 
 * @param {*} iv 
 */
export function Base64Decrypt (text,key,iv) {
  // console.log(key,iv)
  let decrypted = CryptoJS.AES.decrypt(text, CryptoJS.enc.Base64.parse(key), {
    iv: CryptoJS.enc.Base64.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7  //32位不需要添加此一行代码
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

/**
 * base64 密钥加密
 * @param {base64字符串} text 
 * @param {*} key 
 * @param {*} iv 
 */
export function Base64Encrypt(text, key, iv) {
  return CryptoJS.AES.encrypt(text, CryptoJS.enc.Base64.parse(key), {
    iv: CryptoJS.enc.Base64.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7  //key32位不需要添加此一行代码
  }).toString()
}

// export function generateKeys(){
//   var crypt =JSEncryptt;
//   // crypt.getKey();
//   console.log(crypt.getKey())
//   var publicKey = crypt.getPublicKey();
//   var privateKey = crypt.getPrivateKey();

//   // 去除-----*** RSA **** KEY----- 和空格换行
//   // publicKey = (publicKey.split('-----'))[2];
//   // publicKey = publicKey.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "").replace(/\s*/g, "");
//   // privateKey = (privateKey.split('-----'))[2];
//   // privateKey = privateKey.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "").replace(/\s*/g, "");

//   // 返回生成的秘钥对
//   return [publicKey, privateKey];
// }



/**
 * 使用方法
 * 
 * 
 import {Encrypt,Decrypt,Base64Decrypt,Base64Encrypt} from '@/utils/crypto_RSA_AES'

 Base64Decrypt(要解密的base64字符串,localStorage.getItem('AKey'),localStorage.getItem('AIV'))
 Base64Encrypt(要加密的base64字符串,localStorage.getItem('AKey'),localStorage.getItem('AIV'))

 * 
 */


export function RsaHashedKey(modulusLength = 2048, func) {
  console.log('***************************', window.crypto.subtle)
  window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: modulusLength, //can be 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {
          name: "SHA-256"
        }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
    ).then(function (key) {
      window.crypto.subtle.exportKey(
          "pkcs8",
          key.privateKey
        ).then(function (keydata1) {
          window.crypto.subtle.exportKey(
            "spki",
            key.publicKey
          ).then(function (keydata2) {
            var privateKey = RSA2text(keydata1, 1);
            var publicKey = RSA2text(keydata2);
            func(privateKey, publicKey);
          }).catch(function (err) {
            console.error(err);
          });
        })
        .catch(function (err) {
          console.error(err);
        });
    })
    .catch(function (err) {
      console.error(err);
    });

}