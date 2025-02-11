<script lang="ts" setup>
defineProps<{
  id?: string;
  placeholder?: string;
  type: string;
  disabled?: boolean;
  modelValue?: string;
  required?: boolean;
}>();


const emit = defineEmits(['update:modelValue']); // Déclare l'événement `update:modelValue` (ne marche pas avec le trigger personnalisé)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>


<template>
  <input
    :id="id"
    :class="{
      'input': true,
      '-disabled': disabled
    }"
    :placeholder="placeholder"
    :type="type"
    :value="modelValue"
    :required="required"
    :disabled="disabled"
    @input="handleInput"
  >
</template>


<style lang='scss'>
.input {
    padding: remTo(10px);
    border: 2px solid $primary;
    border-radius: remTo(5px);
    width: 100%;

    &:focus-visible {
        outline: 3px solid $secondary;
        outline-offset: -2px;
    }
}
</style>