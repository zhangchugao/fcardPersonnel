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





// import BASE64 from './base64.js'
// const key = '47a28dec00c149c6b5f7a9a868d3e129'
// const iv = 'bd0fbb4f8b10b882'

import CryptoJS from 'crypto-js'
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
 * @param {密文} text 
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



export function Base64Decrypt (text,key,iv) {
  // console.log(key,iv)
  let decrypted = CryptoJS.AES.decrypt(text, CryptoJS.enc.Base64.parse(key), {
    iv: CryptoJS.enc.Base64.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7  //32位不需要添加此一行代码
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}


export function Base64Encrypt(text, key, iv) {
  // CryptoJS.enc.Utf8.parse
  // console.log(CryptoJS.enc.Utf8.parse(iv))
  return CryptoJS.AES.encrypt(text, CryptoJS.enc.Base64.parse(key), {
    iv: CryptoJS.enc.Base64.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7  //key32位不需要添加此一行代码
  }).toString()
}
// import BASE64 from './base64.js'
// console.log(BASE64.decoder('NDdhMjhkZWMwMGMxNDljNmI1ZjdhOWE4NjhkM2UxMjk='),BASE64.encoder('NDdhMjhkZWMwMGMxNDljNmI1ZjdhOWE4NjhkM2UxMjk='))
// const _0x2e57=['bd0fbb4f8b10b882','Pkcs7','pad','AES','decrypt','Utf8','enc','47a28dec00c149c6b5f7a9a868d3e129','CBC','toString','parse','mode'];(function(_0x4f90aa,_0x2e579c){const _0x4193aa=function(_0x37caf2){while(--_0x37caf2){_0x4f90aa['push'](_0x4f90aa['shift']());}};_0x4193aa(++_0x2e579c);}(_0x2e57,0x1b2));const _0x4193=function(_0x4f90aa,_0x2e579c){_0x4f90aa=_0x4f90aa-0x0;let _0x4193aa=_0x2e57[_0x4f90aa];return _0x4193aa;};import _0x12a6aa from'crypto-js';const key=_0x4193('0x5');const iv=_0x4193('0xa');export function Encrypt(_0x284e45){return _0x12a6aa[_0x4193('0x1')]['encrypt'](_0x284e45,_0x12a6aa[_0x4193('0x4')][_0x4193('0x3')][_0x4193('0x8')](key),{'iv':_0x12a6aa[_0x4193('0x4')][_0x4193('0x3')][_0x4193('0x8')](iv),'mode':_0x12a6aa[_0x4193('0x9')][_0x4193('0x6')]})[_0x4193('0x7')]();}export function Decrypt(_0xb50821){let _0x25595a=_0x12a6aa['AES'][_0x4193('0x2')](_0xb50821,_0x12a6aa[_0x4193('0x4')][_0x4193('0x3')]['parse'](key),{'iv':_0x12a6aa['enc'][_0x4193('0x3')][_0x4193('0x8')](iv),'mode':_0x12a6aa[_0x4193('0x9')][_0x4193('0x6')],'padding':_0x12a6aa[_0x4193('0x0')][_0x4193('0xb')]});return _0x25595a[_0x4193('0x7')](_0x12a6aa[_0x4193('0x4')][_0x4193('0x3')]);}