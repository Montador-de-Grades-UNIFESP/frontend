<template>
    <div
      v-if="show"
      class="relative bg-blue-100 border-l-4 border-blue-900 text-alerttext p-4 bg-alertbackground m-3"
      role="alert"
    >
        <div class="flex">
            <div class="font-bold text-xl">{{ title }}</div>
            <div class="text-sm">{{ message }}</div>
        </div>
        <!-- Button to close modal -->
        <button
          @click="show = false"
          class="absolute top-0 bottom-0 right-1 py-2 h-fit"
        >
            <font-awesome-icon class="fill-current h-4 w-4 text-blue-900" icon="fa-solid fa-x" />
        </button>
        <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: false,
      },
    },
    data() {
      return {
        show: true,
      };
    },
  };
  </script>