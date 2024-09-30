<template>
  <div class="cardModal-overlay fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 font-sans flex items-center justify-center">
    <div class="cardModal-wrapper bg-white p-4 rounded-lg w-full max-w-2xl mx-auto">
      <div class="font-bold cardModal-header mb-4 text-black">
        {{ title }}
      </div>
      <div class="cardModal-body">
        <slot></slot>
      </div>
      <div class="cardModal-footer text-right mt-4">
        <button
          class="border border-black rounded px-4 py-1 uppercase text-xs font-medium h-9 tracking-wider"
          @click="$emit('close')"> Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardModal',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
.cardModal-overlay {
  /* Full-screen overlay */
  height: 100vh; /* Full height of the viewport */
}

.cardModal-wrapper {
  /* Responsive dimensions */
  height: 90%; /* 90% of the viewport height */
  max-height: 700px; /* Limit max height */
  width: 90%; /* 90% of the viewport width */
  max-width: 800px; /* Limit max width */
}

.cardModal-body {
  height: 80%; /* 80% of the cardModal height */
  overflow-y: auto; /* Scrollable if content exceeds */
}

@media (max-width: 640px) {
  .cardModal-wrapper {
    height: 95%; /* Adjust for smaller screens */
    width: 95%; /* Adjust for smaller screens */
  }
}
</style>
