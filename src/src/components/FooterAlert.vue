<!-- src/components/FooterAlert.vue -->
<template>
  <Alert
    v-model="alert"
    title="Problemas?"
    close-label="Close Alert"
    color="deep-purple-accent-4"
  >
    Faça um pull request em
    <a href="https://github.com/vpedrota/montador-de-grades">
      <font-awesome-icon
        class="mx-1 align-middle text-3xl text-grey-darken-4"
        icon="fa-brands fa-github"
      />
    </a>
    ou mande uma mensagem para <strong>montadordegrades@gmail.com</strong>.
  </Alert>
</template>

<script setup>
import { ref } from 'vue';
import Alert from './ui/Alert.vue';

const alert = ref(true);
</script>
