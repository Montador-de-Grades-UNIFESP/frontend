<template>
    <div>
      <button @click="showModal = true">Abrir Modal</button>
      <modal v-if="showModal" @close="showModal = false" :title="modalTitle">
      {{ content }}
      </modal>
    </div>
  </template>
  
  <script>
  import Modal from './Modal.vue';
  export default {
    components: {
        Modal
    },
    props: ['title', 'content'],
    data() {
      return {
        showModal: false
      };
    }
  };
  </script>