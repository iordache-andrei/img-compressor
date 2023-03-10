<template>
  <div class="text-tertiary">
    <h1>JPEG/WEBP compressor and image resizer</h1>

    <div class="mt-3">
      <div class="picker">
        <label for="images">Pick images</label>
        <input
          type="file"
          name="images"
          id="images"
          class="d-block"
          @change="getFiles($event)"
          accept="image/webp, image/png, image/jpeg, image/jpg"
          multiple
        />
      </div>
    </div>
    <div class="mt-3" v-if="bundle.url && counter.beanCounter >= counter.items">
      <a :href="bundle.url" :download="bundle.time + '_package'"
        >Download Set</a
      >
    </div>

    <div class="mt-3">
      <h3 class="fw-bold">IMPORTANT NOTES!</h3>
      <p>
        PNG files ar not compressable using client-side/browser engines. The
        only thing they will do is resize if the bellow does not happen.
      </p>
      <p>
        Some PNG images may have corrupt data even while being displayed
        properly. If that is the case they may not be resized in the zip file
        but appear to have been resized.
      </p>
      <p>
        Client-side compression <span class="fw-bold">CAN NOT</span> drop under
        a certain compression threshold. If the image uploaded has already been
        compressed, compression itself will be skipped and only resizing will
        take place if required.
      </p>
      <div>
        <p class="fw-bold">RESIZING</p>
        <p>
          If the image has a width equal or greater than 1280px, a new image
          will be generated with it's width half of the original size
        </p>
        <p>
          If the image width divided by 2 is greater than 1280px, a new image
          will be generated with the width of 1280px
        </p>
        <p>
          All images keep their aspect ratio and height will be auto-calculated
          to respect the ratio.
        </p>
      </div>
    </div>

    <div class="mt-3" v-if="unprocessed.length">
      <p>
        The following files are unsupported due to file format and will not be
        processed:
      </p>
      <p>{{ unprocessed.join(', ') }}</p>
    </div>

    <div class="mt-3 grid" v-if="Object.keys(items).length">
      <div class="child" v-for="item of Object.entries(items)" :key="item[0]">
        <div>
          <img
            :src="item[1].src"
            alt=""
            class="w-100"
            style="object-fit: contain"
          />
        </div>
        <div class="mt-2">
          <p>Resolution: {{ item[1].width }}x{{ item[1].height }}</p>
          <p>Original size: {{ item[1].originalSize }}</p>
          <p>New size: {{ item[1].newSize }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import Compressor from 'compressorjs'

import JSZip from 'jszip'

// data points

let bundle = ref({ time: '', url: '' })
let counter = ref({ items: Number(0), beanCounter: Number(0) })
let items = ref({})
let unprocessed = ref([])

let fileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

const dateGenerator = () => {
  let today = new Date().toLocaleDateString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return today.replaceAll(' ', '__').replaceAll(',', '').replaceAll(':', '-')
}

const bytesToMegaBytes = (bytes, digits = 2) =>
  digits ? (bytes / (1024 * 1024)).toFixed(digits) : bytes / (1024 * 1024)

const getFiles = async (e) => {
  unprocessed.value = []
  items.value = {}
  counter.value.items = Number(0)
  counter.value.beanCounter = Number(0)

  let zip = new JSZip()

  let extesion = new RegExp(/(\.\w+)/, 'gmi')
  let flatten = new RegExp(/(@|-|=|\s|\t)/, 'gmi')

  // counter.value.items = e.target.files.length

  for await (let file of e.target.files) {
    if (fileTypes.includes(file.type)) {
      counter.value.items++

      let r = (Math.random() + 1).toString(36).substring(7)

      let imgData = {
        width: '',
        height: '',
        aspectRatio: '',
      }
      let imgBundle = zip.folder(
        file.name.replaceAll(extesion, '').replaceAll(flatten, '')
      )

      let img = new Image()
      img.src = window.URL.createObjectURL(file)

      await img.decode().then(() => {
        imgData.height = Number(img.height)
        imgData.width = Number(img.width)
        imgData.aspectRatio = Number(img.width / img.height)
      })

      let compression = () =>
        new Compressor(file, {
          quality: 0.8,
          convertSize: 'Infinity',

          async success(res) {
            imgBundle.file(
              file.name.replaceAll(extesion, '').replaceAll(flatten, '') +
                '__' +
                imgData.width +
                'x' +
                imgData.height +
                '.' +
                res.type.split('/')[1],
              res
            )

            counter.value.beanCounter++

            zip.generateAsync({ type: 'blob' }).then(function (content) {
              bundle.value.time = dateGenerator()
              bundle.value.url = window.URL.createObjectURL(content)
            })

            items.value[
              file.name.replaceAll(flatten, '_').replaceAll(extesion, '') +
                '-' +
                r
            ] = {
              name: file.name,
              src: window.URL.createObjectURL(file),
              originalSize: bytesToMegaBytes(file.size) + ' MB',
              width: img.width,
              height: img.height,
              newSize: bytesToMegaBytes(res.size) + ' MB',
            }
          },
        })

      let halfSize = () => {
        new Compressor(file, {
          quality: 0.8,
          width: Math.round(Number(imgData.width) / 2),
          convertSize: 'Infinity',

          async success(res) {
            counter.value.items++
            imgBundle.file(
              file.name.replaceAll(extesion, '').replaceAll(flatten, '') +
                '__hlf__' +
                Math.round(imgData.width / 2) +
                'x' +
                Math.round(imgData.height / 2) +
                '.' +
                res.type.split('/')[1],
              res
            )
            counter.value.beanCounter++

            zip.generateAsync({ type: 'blob' }).then(function (content) {
              bundle.value.time = dateGenerator()
              bundle.value.url = window.URL.createObjectURL(content)
            })
          },
        })
      }
      let thumbnail = () => {
        new Compressor(file, {
          quality: 0.8,
          width: 1280,
          convertSize: 'Infinity',

          async success(res) {
            counter.value.items++
            imgBundle.file(
              file.name.replaceAll(extesion, '').replaceAll(flatten, '') +
                '__thmb__' +
                1280 +
                'x' +
                Math.round(1280 / imgData.aspectRatio) +
                '.' +
                res.type.split('/')[1],
              res
            )
            counter.value.beanCounter++

            zip.generateAsync({ type: 'blob' }).then(function (content) {
              bundle.value.time = dateGenerator()
              bundle.value.url = window.URL.createObjectURL(content)
            })
          },
        })
      }

      compression()
      if (imgData.width >= 1280) {
        // counter.value.items = counter.value.items * 2
        halfSize()
      }
      if (Math.floor(imgData.width / 2) > 1280) {
        thumbnail()
      }
      // console.log(imgData)
    } else {
      unprocessed.value.push(file.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  p {
    margin-bottom: 0;
  }
}
</style>
