import {
  generateKeys
} from '@/utils/RSA_key';

onmessage = function (event) {
  //从1加到num
  // var num = event.data;
  // var result = 0;
  // for (var i = 1; i <= num; i++) {
  //   result += i;
  // };
  console.log(event,'***************************************')
  let rsam = generateKeys()
  let RsaKey = {}
  RsaKey.public = rsam[0];
  RsaKey.private = rsam[1];
  postMessage(RsaKey);
}