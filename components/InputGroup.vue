<script setup lang="ts">
defineProps<{
  id?: string;
  placeholder?: string;
  type: string;
  disabled?: boolean;
  modelValue?: string;
  required?: boolean;
}>();


const emit = defineEmits(['update:modelValue']); // Permet l'émission d'événements

// Gérer la mise à jour de la valeur
const updateValue = (value: string) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <div class="input-group">
    <label class="input-group__label" :for="id"><slot /></label>
    <Input 
      :id="id" 
      :placeholder="placeholder" 
      :type="type" 
      :disabled="disabled"
      :model-value="modelValue"
      :required="required"
      @update:model-value="updateValue"
    />
  </div>
</template>


<style lang='scss'>
.input-group {
    display: flex;
    flex-direction: column;
    gap: remTo(5px);
    width: -webkit-fill-available;

    &__label {
        font-size: $largeTxt;
        font-weight: 500;
    }
}
</style>