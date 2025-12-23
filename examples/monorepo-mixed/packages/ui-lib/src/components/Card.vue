<template>
  <div :class="['card', { 'card--elevated': elevated }]">
    <header v-if="title || $slots.header" class="card__header">
      <slot name="header">
        <h3 class="card__title">{{ title }}</h3>
      </slot>
    </header>
    
    <div class="card__content">
      <slot />
    </div>
    
    <footer v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  elevated?: boolean;
}

withDefaults(defineProps<Props>(), {
  elevated: false
});
</script>

<style scoped>
.card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.card--elevated {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
}

.card__header {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.card__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
}

.card__content {
  padding: 1rem;
}

.card__footer {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}
</style>