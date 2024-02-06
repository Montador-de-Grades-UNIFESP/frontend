<template>
    <div>
      <button @click="showModal = true">Abrir Modal</button>
      <Modal v-if="showModal" @close="showModal = false" :title="modalTitle">
      {{ content }}
      </Modal>
    </div>
  </template>
  
  <script>
import Modal from '@/components/Modal.vue';
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