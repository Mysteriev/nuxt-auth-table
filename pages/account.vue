<template>
  <div class="container mx-auto p-4 md:p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Account Details</h1>
      <UButton color="red" variant="soft" @click="handleLogout">Logout</UButton>
    </div>

    <div v-if="authStore.user" class="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-md">
      Welcome back, {{ authStore.user.name }} {{ authStore.user.surname }}!
    </div>

    <div v-if="usersStore.error" class="mb-4 text-red-500 dark:text-red-400">
      Error loading users: {{ usersStore.error }}
    </div>

    <!-- Filtering Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border dark:border-gray-700 rounded-md">
       <div>
         <label for="dateFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Creation Date (On or After)</label>
         <UInput id="dateFilter" type="date" v-model="dateFilter" placeholder="Filter by date created" />
       </div>
       <div>
         <label for="statusFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Status</label>
         <USelectMenu
            id="statusFilter"
            v-model="statusFilter"
            :options="statusOptions"
            multiple
            placeholder="Filter by status"
            value-attribute="value"
            option-attribute="label"
         />
       </div>
       <div>
         <UButton @click="clearFilters" class="mt-6">Clear Filters</UButton>
       </div>
    </div>

    <!-- User Table -->
    <UTable
      :rows="filteredUsers"
      :columns="columns"
      :loading="usersStore.loading"
      :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No users found.' }"
    >
      <!-- Custom slot for status -->
       <template #status-data="{ row }">
        <UBadge :color="row.status ? 'green' : 'red'" variant="subtle">
          {{ row.status ? 'Active' : 'Inactive' }}
        </UBadge>
      </template>

       <!-- Custom slot for date formatting -->
       <template #date_created-data="{ row }">
         {{ formatDate(row.date_created) }}
       </template>
    </UTable>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/store/auth';
import { useUsersStore } from '~/store/users';
import type { UserForTable } from '~/types';

// Define columns for Nuxt UI Table
const columns = [
  { id: 'id', key: 'id', label: 'Username (ID)', sortable: true }, 
  { id: 'name', key: 'name', label: 'First Name', sortable: true }, 
  { id: 'surname', key: 'surname', label: 'Last Name', sortable: true }, 
  { id: 'status', key: 'status', label: 'Status', sortable: true }, 
  { id: 'date_created', key: 'date_created', label: 'Date Created', sortable: true }, 
];


// Status options for the filter dropdown
const statusOptions = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false },
];

const authStore = useAuthStore();
const usersStore = useUsersStore();

// Filters
const dateFilter = ref(''); // YYYY-MM-DD format from date input
const statusFilter = ref<boolean[]>([]); // Array for multi-select

// Fetch users when the component mounts
onMounted(() => {
  usersStore.fetchUsers();
});

// Computed property for filtered users
const filteredUsers = computed(() => {
  let users = usersStore.users;

  // Apply date filter
  if (dateFilter.value) {
    try {
      // Get timestamp for the START of the selected day
      const filterTimestamp = new Date(dateFilter.value).setHours(0, 0, 0, 0);
      if (!isNaN(filterTimestamp)) {
          users = users.filter(user => user.created_timestamp >= filterTimestamp);
      }
    } catch(e) {
        console.error("Error parsing date filter:", e);
    }
  }

  // Apply status filter (multi-select)
  if (statusFilter.value.length > 0) {
    users = users.filter(user => statusFilter.value.includes(user.status));
  }

  return users;
});

function handleLogout() {
  authStore.logout();
}

function clearFilters() {
    dateFilter.value = '';
    statusFilter.value = [];
}

// Helper to format date string (optional, can customize)
function formatDate(dateStr: string): string {
    // Assuming DD.MM.YYYY HH:MM:SS format
    // You might want a more robust parsing/formatting library like date-fns
    try {
        const parts = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
        if (!parts) return dateStr; // Return original if format is unexpected
        const date = new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]), parseInt(parts[4]), parseInt(parts[5]), parseInt(parts[6]));
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString(); // Adjust format as needed
    } catch (e) {
        return dateStr; // Return original on error
    }
}

// Ensure the user is authenticated (middleware should handle this, but good practice)
// definePageMeta({
//   middleware: 'auth' // Apply specific middleware if not using global
// });
</script>

<style scoped lang="scss">
/* Add specific styles for account page if needed */
.container {
  max-width: 1200px;
}
</style>
