<!-- src/components/CellModal.vue -->
<template>
  <Modal :title="title" @close="$emit('close')">
    <ListaUC :horario="hour" :dia="day" :listaSelecionadas="selectedUCs" @updateValue="addUCAndClose" />
  </Modal>
</template>

<script setup>
import { useUserData } from '../composables/useUserData';
import Modal from './ui/Modal.vue';
import ListaUC from './ui/ListaUC.vue';
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits([ 'close' ]);

const props = defineProps({
  title: String,
  day: String,
  hour: String,
});

function addUCAndClose(uc) {
  addUC(uc);
  emit('close');
}

const { daysOfWeek, hours, selectedUCs, addUC } = useUserData();
</script>
