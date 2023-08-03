<template>
  <div class="modal-overlay fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 font-sans">
    <div class="modal-wrapper bg-white p-4 rounded-lg md:max-w-[80%] max-w-[90%] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
      <div class="font-bold modal-header mb-4 text-black">
        {{ title }}
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer text-right mt-4">
        <button
          class="border-1 border-black rounded px-4 py-1 uppercase text-xs font-medium h-9 tracking-widerx"
          @click="$emit('close')"> Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
.modal-body{
  height: 400px;
  max-height: 500px;
}

</style>