<template>
  <Card elevated>
    <template #header>
      <div class="user-card__header">
        <div class="user-card__avatar">
          {{ initials }}
        </div>
        <div>
          <h3 class="user-card__name">{{ user.name }}</h3>
          <p class="user-card__email">{{ user.email }}</p>
        </div>
      </div>
    </template>
    
    <div class="user-card__info">
      <div class="user-card__field">
        <span class="user-card__label">ID:</span>
        <span class="user-card__value">{{ user.id }}</span>
      </div>
      <div class="user-card__field">
        <span class="user-card__label">Role:</span>
        <span :class="['user-card__badge', `user-card__badge--${user.role}`]">
          {{ user.role }}
        </span>
      </div>
    </div>
    
    <template #footer>
      <slot name="actions" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { User } from '@monorepo-mixed/shared';
import Card from './Card.vue';

interface Props {
  user: User;
}

const props = defineProps<Props>();

const initials = computed(() => {
  return props.user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});
</script>

<style scoped>
.user-card__header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
}

.user-card__name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #212529;
}

.user-card__email {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #6c757d;
}

.user-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-card__field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-card__label {
  font-weight: 500;
  color: #6c757d;
  min-width: 60px;
}

.user-card__value {
  color: #212529;
}

.user-card__badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.user-card__badge--admin {
  background: #ffc107;
  color: #000;
}

.user-card__badge--user {
  background: #28a745;
  color: white;
}
</style>