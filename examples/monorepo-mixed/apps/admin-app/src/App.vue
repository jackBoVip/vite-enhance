<template>
  <div class="admin-app">
    <nav class="admin-nav">
      <h1>Admin Dashboard</h1>
      <div class="nav-links">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['nav-link', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    </nav>
    
    <main class="admin-main">
      <div v-if="activeTab === 'dashboard'" class="dashboard">
        <div class="stats-grid">
          <Card v-for="stat in stats" :key="stat.label" elevated>
            <div class="stat">
              <div class="stat__value">{{ stat.value }}</div>
              <div class="stat__label">{{ stat.label }}</div>
            </div>
          </Card>
        </div>
      </div>
      
      <div v-else-if="activeTab === 'users'" class="users-section">
        <Card title="User Management" elevated>
          <div class="users-table">
            <div class="table-header">
              <div>User</div>
              <div>Role</div>
              <div>Actions</div>
            </div>
            <div v-for="user in users" :key="user.id" class="table-row">
              <div class="user-info">
                <div class="user-avatar">{{ getInitials(user.name) }}</div>
                <div>
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
              </div>
              <div>
                <span :class="['role-badge', `role-badge--${user.role}`]">
                  {{ user.role }}
                </span>
              </div>
              <div class="actions">
                <Button variant="secondary" @click="editUser(user)">
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  @click="deleteUser(user.id)"
                  :disabled="user.role === 'admin'"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div v-else-if="activeTab === 'settings'" class="settings-section">
        <Card title="System Settings" elevated>
          <div class="settings-form">
            <div class="form-group">
              <label>Site Name:</label>
              <input v-model="settings.siteName" type="text" />
            </div>
            <div class="form-group">
              <label>Maintenance Mode:</label>
              <input v-model="settings.maintenanceMode" type="checkbox" />
            </div>
            <div class="form-group">
              <label>Max Users:</label>
              <input v-model.number="settings.maxUsers" type="number" />
            </div>
            <Button @click="saveSettings" :loading="isSaving">
              Save Settings
            </Button>
          </div>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Button, Card } from '@monorepo-mixed/ui-lib';
import type { User } from '@monorepo-mixed/shared';
import { formatDate } from '@monorepo-mixed/shared';

const activeTab = ref('dashboard');

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Users' },
  { id: 'settings', label: 'Settings' }
];

const stats = ref([
  { label: 'Total Users', value: '1,234' },
  { label: 'Active Sessions', value: '89' },
  { label: 'Revenue', value: '$12,345' },
  { label: 'Orders', value: '567' }
]);

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
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user'
  }
]);

const settings = reactive({
  siteName: 'My App',
  maintenanceMode: false,
  maxUsers: 1000
});

const isSaving = ref(false);

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function editUser(user: User) {
  alert(`Edit user: ${user.name}`);
}

function deleteUser(userId: string) {
  if (confirm('Are you sure you want to delete this user?')) {
    users.value = users.value.filter(u => u.id !== userId);
  }
}

async function saveSettings() {
  isSaving.value = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  alert('Settings saved successfully!');
  isSaving.value = false;
}
</script>

<style scoped>
.admin-app {
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-nav {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-nav h1 {
  margin: 0;
  color: #212529;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: #6c757d;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-link:hover {
  background: #f8f9fa;
  color: #212529;
}

.nav-link.active {
  background: #007bff;
  color: white;
}

.admin-main {
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat {
  text-align: center;
  padding: 1rem;
}

.stat__value {
  font-size: 2rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 0.5rem;
}

.stat__label {
  color: #6c757d;
  font-size: 0.875rem;
}

.users-table {
  display: grid;
  gap: 1rem;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-weight: 600;
  color: #212529;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-name {
  font-weight: 500;
  color: #212529;
}

.user-email {
  font-size: 0.875rem;
  color: #6c757d;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge--admin {
  background: #ffc107;
  color: #000;
}

.role-badge--user {
  background: #28a745;
  color: white;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.settings-form {
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

.form-group input[type="text"],
.form-group input[type="number"] {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
</style>