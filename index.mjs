import { fileOpen } from './browser-fs-access-main/index.js'
import clipboardCopy from './clipboard-copy/index.mjs'
import md5 from "./md5/index.mjs"
import Toast from './toast/index.mjs'

$("img.upload").addEventListener("click", async () => {
  try {
    const img = await pickImg()
    await upload(img)
  } catch(e) {
    console.log(e)
    Toast.error(String(e))
  }
})
$("button").addEventListener("click", async () => {
  try {
    await clipboardCopy($("input").value)
    Toast.success("copy success")
  } catch(e) {
    Toast.error(String(e))
    console.log(e)
  }
})
async function upload(img) {
  const formData = new FormData()
  const nonce = Math.round(Math.random() * 1000000000)
  const ts = Math.trunc(+Date.now() / 1000)
  const token = "10c5a9d400c742cf8431a51df928d539"
  const sign = md5(`${token}_${ts}_${nonce}`)
  console.log(`${token}_${ts}_${nonce}`)
  console.log(sign)
  formData.append("file", img, img.name)
  formData.append("nonce", String(nonce))
  formData.append("ts", String(ts))
  formData.append("token", token)
  formData.append("sign", sign)
  formData.append("categories", "PicGo")
  const res = await (await fetch("https://api.superbed.cn/upload", {
    method: "POST",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36'
    },
    body: formData
  })).json()
  console.log(res)
  if (res.err === 0) {
    Toast.success("upload success")
    $("img.preview").src = URL.createObjectURL(img)
    $("input").value = `https://pic.wuuconix.link/item/${res.ids[0]}`
    $("img.upload").classList.add("hidden")
    $("div.wrapper").classList.remove("hidden")
  } else {
    throw JSON.stringify(res)
  }
}
async function pickImg() {
  const pickerOpts = {
    types: [
      {
        description: 'Images',
        accept: {
          'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp'],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  }
  const fileData = await fileOpen(pickerOpts)
  return fileData
}
function $(...args) {
  return document.querySelector(...args)
}