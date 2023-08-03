<template>
    <button 
        class="uppercase text-xs font-medium tracking-widerx border-1 rounded h-9"
        :class="class"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '',
        },
        class: {
            type: String,
            default: '',
        },
    },
}
</script>