<script setup>
import { ref, reactive, computed } from "vue";

defineProps({
  msg: {
    type: String,
    default: "Test",
  },
});

const count = reactive({ count: Number(0) });
const countOffer = ref(0);

const emit = defineEmits(["count"]);

const countEmit = computed({
  get() {
    return `${countOffer.value} - ${count.count}`;
  },
  set(val) {
    // emit('count', val)

    console.log(val);
  },
});
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count.count++">
      count is {{ count.count }}
    </button>
    <button type="button" @click="countOffer++, $emit('count', countOffer)">
      countOffer is {{ countOffer }}
    </button>
    {{ countEmit }}
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped lang="scss">
.read-the-docs {
  color: #888;
}

.card {
  button {
    color: #000;
  }
}
</style>
