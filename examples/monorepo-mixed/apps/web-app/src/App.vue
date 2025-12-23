<template>
  <div class="app">
    <header class="app__header">
      <h1>Web App - Monorepo Example</h1>
      <p>Demonstrating shared packages and UI library</p>
    </header>
    
    <main class="app__main">
      <Card title="Users" elevated>
        <div class="users-grid">
          <UserCard
            v-for="user in users"
            :key="user.id"
            :user="user"
          >
            <template #actions>
              <Button 
                variant="primary" 
                @click="editUser(user)"
              >
                Edit
              </Button>
              <Button 
                variant="danger" 
                @click="deleteUser(user.id)"
              >
                Delete
              </Button>
            </template>
          </UserCard>
        </div>
      </Card>
      
      <Card title="Add New User" elevated>
        <form @submit.prevent="addUser" class="user-form">
          <div class="form-group">
            <label>Name:</label>
            <input v-model="newUser.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="newUser.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Role:</label>
            <select v-model="newUser.role">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Button type="submit" :loading="isAdding">
            Add User
          </Button>
        </form>
      </Card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Button, Card, UserCard } from '@monorepo-mixed/ui-lib';
import type { User } from '@monorepo-mixed/shared';
import { formatDate, debounce } from '@monorepo-mixed/shared';

const users = ref<User[]>([
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user'
  }
]);

const newUser = reactive({
  name: '',
  email: '',
  role: 'user' as 'user' | 'admin'
});

const isAdding = ref(false);

const addUser = debounce(async () => {
  isAdding.value = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user: User = {
    id: Date.now().toString(),
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  };
  
  users.value.push(user);
  
  // Reset form
  newUser.name = '';
  newUser.email = '';
  newUser.role = 'user';
  
  isAdding.value = false;
}, 300);

function editUser(user: User) {
  alert(`Edit user: ${user.name}`);
}

function deleteUser(userId: string) {
  if (confirm('Are you sure?')) {
    users.value = users.value.filter(u => u.id !== userId);
  }
}
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app__header {
  text-align: center;
  margin-bottom: 2rem;
}

.app__header h1 {
  color: #212529;
  margin-bottom: 0.5rem;
}

.app__header p {
  color: #6c757d;
  margin: 0;
}

.app__main {
  display: grid;
  gap: 2rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.user-form {
  display: grid;
  gap: 1rem;
  max-width: 400px;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #212529;
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
</style>