<template>
  <div class="modal-overlay">
    <div class="modal-wrapper">
      <div class="modal-header">
        {{ title }}
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <v-btn
          variant="outlined"
          class="mr-1"
          @click="$emit('close')"> Fechar
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title'],
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  max-width: 80vw
}

.modal-header {
  font-weight: bold;
  margin-bottom: 1rem;
}

.modal-footer {
  text-align: right;
  margin-top: 1rem;
}

.modal-body{
  height: 400px;
  overflow-y: scroll;
  max-height: 500px;
}

</style>