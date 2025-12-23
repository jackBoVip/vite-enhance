<template>
  <button 
    :class="['btn', `btn--${variant}`, { 'btn--loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="btn__spinner">⏳</span>
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
  loading: false
});

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--primary {
  background: #007bff;
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn--secondary {
  background: #6c757d;
  color: white;
}

.btn--secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn--danger {
  background: #dc3545;
  color: white;
}

.btn--danger:hover:not(:disabled) {
  background: #c82333;
}

.btn--loading {
  pointer-events: none;
}

.btn__spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>