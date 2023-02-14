const { randomBytes, createHash } = require('crypto')
const secp256k1 = require('secp256k1')
const fetch = require('node-fetch')

const appId = "5dde4e1bdf9e4966b387ba58f4b3fdc3"
const deviceId = "796fe487-b8e3-4b7b-XXXX-d027b142a157"
const userId = "XXXe1df32b0d44ac9bf9f2d05522XXXX"
const nonce = 0

const str = `${appId}:${deviceId}:${userId}:${nonce}`

let privateKey
do {
  privateKey = randomBytes(32)
} while (!secp256k1.privateKeyVerify(privateKey))
const pubKey1 = secp256k1.publicKeyCreate(privateKey)
const pubKey2 = "04"+Buffer.from(pubKey1).toString('hex')

function sign(string) {
  const sha256 = createHash('sha256').update(string).digest('hex')
  const fromHexString = (hexString) =>
    Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  const data = fromHexString(sha256)
  const signature = secp256k1.ecdsaSign(data, privateKey).signature
  return Buffer.from(signature).toString('hex')+"01"
}

const signature = sign(str)

const headers = {
  "authorization": "Bearer XXXXXXXXXXXXXXXXXXXXXXXX.eyJ1c2VySWQiOiI4NjllMWRmMzJiMGQ0NGFjOWJmOWYyZDA1NTIyZjk1YSIsImN1c3RvbUpzb24iOiJ7XCJjbGllbnRJZFwiOlwiMjVkelgzdmJZcWt0Vnh5WFwiLFwiZG9tYWluSWRcIjpcImJqMjlcIixcInNjb3BlXCI6W1wiRFJJVkUuQUxMXCIsXCJTSEFSRS5BTExcIixcIkZJTEUuQUxMXCIsXCJVU0VSLkFMTFwiLFwiVklFVy5BTExcIixcIlNUT1JBR0UuQUxMXCIsXCJTVE9SQUdFRklMRS5MSVNUXCIsXCJCQVRDSFwiLFwiT0FVVEguQUxMXCIsXCJJTUFHRS5BTExcIixcIklOVklURS5BTExcIixcIkFDQ09VTlQuQUxMXCIsXCJTWU5DTUFQUElORy5MSVNUXCIsXCJTWU5DTUFQUElORy5ERUxFVEVcIl0sXCJyb2xlXCI6XCJ1c2VyXCIsXCJyZWZcIjpcImh0dHBzOi8vd3d3LmFsaXl1bmRyaXZlLmNvbS9cIixcImRldmljZV9pZFwiOlwiZTk3MWJjN2EwZGUzNDMwNzkxNWU4MmI0YzFmMzAwMGZcIn0iLCJleHAiOjE2NzYzODUwODMsImlhdCI6MTY3NjM3NzgyM30.sL9zqmvQ0TFmyE0Jy44sXb77lqN_A1ZFMO3uAH3PL21ZDUJRqZ1MyZIWMkedY6Ak1TntopkbcwENt-1IPAaStg5MkuZg-pImd8DOaiEzLrM6fMhbbQ523jT8wnb1vx5IznAP0DjeD5AQqDySz6la9pH39p1QFzL4ITv36ix6Oe0",
  "origin": "https://www.aliyundrive.com",
  "content-type": "application/json;charset=UTF-8",
  "referer": "https://www.aliyundrive.com/",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41",
  "x-canary": "client=web,app=adrive,version=v3.17.0",
  "x-device-id": deviceId,
  "x-signature": signature,
}

const url = "https://api.aliyundrive.com/users/v1/users/device/create_session"
fetch(url, {
  method: 'POST',
  body: JSON.stringify({
    "deviceName": "Chrome浏览器",
    "modelName": "Mac OS网页版",
    "pubKey": pubKey2,
  }),
  headers: headers
}).then(response => {
  const data = response.json()
  return data
}).then(data => {
  console.log(data)
  if (data.result) {
    console.log('成功')
    const url2 = "https://api.aliyundrive.com/v2/file/get_download_url"
    fetch(url2, {
      method: "POST",
      body: JSON.stringify({
        "expire_sec": 14400,
        "drive_id": "xxxxx",
        "file_id": "xxxxxxxxx"
      }),
      headers: headers
    }).then(response2 => {
      return response2.json()
    }).then(data2 => {
      console.log(data2)
    })
  }
})
