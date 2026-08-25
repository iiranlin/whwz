import { sm2 } from 'sm-crypto'

// SM2 加密（cipherMode=1 即 C1C3C2，输出带 04 前缀，与标品 base 后端 @EncryptData 对应）
export function encrypt(data, publicKey, cipherMode = 1) {
  if (typeof data === 'object') {
    data = JSON.stringify(data)
  }
  return '04' + sm2.doEncrypt(data, publicKey, cipherMode)
}

// SM2 解密
export function decrypt(data, privateKey, cipherMode = 1) {
  return sm2.doDecrypt(data, privateKey, cipherMode)
}
