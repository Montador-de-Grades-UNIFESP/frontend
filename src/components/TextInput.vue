<template>
  <div class="text-base">
    <input
      type="text"
      v-model="query"
      class="shadow-md rounded-md px-3 py-2 w-full"
      :placeholder="placeholder"
      @input="$emit('search', query)"
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
    };
  },
  props: {
    placeholder: {
      type: String,
      default: '',
    },
  },
  methods: {
    search() {
      console.log('emit search')
      this.$emit('search', this.query);
    },
  },
};
</script>