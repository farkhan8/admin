<template>
    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div :class="[
        'rounded-lg p-4 shadow-lg transition-all duration-300',
        toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <!-- Success Icon -->
            <svg v-if="toastType === 'success'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <!-- Error Icon -->
            <svg v-else class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium">{{ toastMessage }}</span>
          </div>
          <button @click="hideToast" class="ml-4 text-white hover:text-gray-200">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">Tambah Pengguna Baru</h2>
          <Link 
            :href="route('admin.users.index')" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Kembali ke Daftar Pengguna
          </Link>
        </div>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <form @submit.prevent="submit">
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Informasi Akun</h3>
                  <p class="mt-1 text-sm text-gray-500">Informasi dasar pengguna untuk login ke sistem.</p>
                </div>

                <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <!-- Nama Lengkap -->
                  <div class="sm:col-span-3">
                    <label for="name" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input 
                      type="text" 
                      id="name" 
                      v-model="form.name" 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      :class="{ 'border-red-500': form.errors.name }"
                    >
                    <p v-if="form.errors.name" class="mt-2 text-sm text-red-600">
                      {{ form.errors.name }}
                    </p>
                  </div>

                  <!-- Email -->
                  <div class="sm:col-span-3">
                    <label for="email" class="block text-sm font-medium text-gray-700">Alamat Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      v-model="form.email" 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      :class="{ 'border-red-500': form.errors.email }"
                    >
                    <p v-if="form.errors.email" class="mt-2 text-sm text-red-600">
                      {{ form.errors.email }}
                    </p>
                  </div>

                  <!-- Password -->
                  <div class="sm:col-span-3">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input 
                      type="password" 
                      id="password" 
                      v-model="form.password" 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      :class="{ 'border-red-500': form.errors.password || passwordError }"
                      @blur="validatePassword"
                    >
                    <p class="mt-1 text-xs text-gray-500">
                      Password harus minimal 8 karakter
                    </p>
                    <p v-if="form.errors.password" class="mt-2 text-sm text-red-600">
                      {{ form.errors.password }}
                    </p>
                    <p v-if="passwordError" class="mt-2 text-sm text-red-600">
                      {{ passwordError }}
                    </p>
                  </div>

                  <!-- Konfirmasi Password -->
                  <div class="sm:col-span-3">
                    <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                    <input 
                      type="password" 
                      id="password_confirmation" 
                      v-model="form.password_confirmation" 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      :class="{ 'border-red-500': passwordConfirmationError }"
                      @blur="validatePasswordConfirmation"
                    >
                    <p class="mt-1 text-xs text-gray-500">
                      Konfirmasi password harus sama dengan password
                    </p>
                    <p v-if="passwordConfirmationError" class="mt-2 text-sm text-red-600">
                      {{ passwordConfirmationError }}
                    </p>
                  </div>

                  <!-- Role -->
                  <div class="sm:col-span-3">
                    <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                    <select 
                      id="role" 
                      v-model="form.role" 
                      class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      :class="{ 'border-red-500': form.errors.role }"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <p v-if="form.errors.role" class="mt-2 text-sm text-red-600">
                      {{ form.errors.role }}
                    </p>
                  </div>

                  <!-- Nomor Telepon -->
                  <div class="sm:col-span-3">
                    <label for="telepon" class="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <input 
                      type="text" 
                      id="telepon" 
                      v-model="form.telepon" 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      :class="{ 'border-red-500': form.errors.telepon }"
                    >
                    <p v-if="form.errors.telepon" class="mt-2 text-sm text-red-600">
                      {{ form.errors.telepon }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-8 flex justify-end space-x-3">
                <Link 
                  :href="route('admin.users.index')" 
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Batal
                </Link>
                <button 
                  type="submit" 
                  :disabled="form.processing"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span v-if="form.processing">Menyimpan...</span>
                  <span v-else>Simpan User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Link } from '@inertiajs/vue3';

// Toast notification state
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success'); // 'success' or 'error'

// Password validation state
const passwordError = ref('');
const passwordConfirmationError = ref('');

const showNotification = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    showToast.value = false;
  }, 5000);
};

const hideToast = () => {
  showToast.value = false;
};

// Password validation functions
const validatePassword = () => {
  passwordError.value = '';
  
  if (form.password && form.password.length < 8) {
    passwordError.value = 'Password harus minimal 8 karakter';
    return false;
  }
  
  // Re-validate password confirmation when password changes
  if (form.password_confirmation) {
    validatePasswordConfirmation();
  }
  
  return true;
};

const validatePasswordConfirmation = () => {
  passwordConfirmationError.value = '';
  
  if (form.password_confirmation && form.password !== form.password_confirmation) {
    passwordConfirmationError.value = 'Konfirmasi password tidak sama dengan password';
    return false;
  }
  
  return true;
};

const validateForm = () => {
  const isPasswordValid = validatePassword();
  const isPasswordConfirmationValid = validatePasswordConfirmation();
  
  return isPasswordValid && isPasswordConfirmationValid;
};

defineOptions({
    layout: AdminLayout,
});

const form = useForm({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'user',
  telepon: ''
});

const submit = () => {
  // Validate form before submission
  if (!validateForm()) {
    showNotification('Mohon periksa kembali data yang diisi', 'error');
    return;
  }
  
  form.post(route('admin.users.store'), {
    onSuccess: (response) => {
      showNotification('Pengguna berhasil ditambahkan!', 'success');
      // Form will automatically redirect due to Laravel redirect
    },
    onError: (errors) => {
      // Handle validation errors
      if (errors && typeof errors === 'object') {
        const errorMessages = [];
        
        // Check for specific validation errors
        Object.keys(errors).forEach(key => {
          if (Array.isArray(errors[key])) {
            errorMessages.push(...errors[key]);
          } else {
            errorMessages.push(errors[key]);
          }
        });
        
        if (errorMessages.length > 0) {
          showNotification(errorMessages[0], 'error');
        } else {
          showNotification('Terjadi kesalahan validasi.', 'error');
        }
      } else {
        showNotification('Terjadi kesalahan saat menambahkan pengguna.', 'error');
      }
    }
  });
};
</script>
