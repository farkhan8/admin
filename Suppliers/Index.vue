<template>
  <!-- Delete Confirmation Modal -->
  <Transition enter-active-class="ease-out duration-300"
             enter-from-class="opacity-0"
             enter-to-class="opacity-100"
             leave-active-class="ease-in duration-200"
             leave-from-class="opacity-100"
             leave-to-class="opacity-0">
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full mx-4">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Hapus Supplier</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus supplier <span class="font-medium">{{ supplierToDelete?.nama }}</span>? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="confirmDelete" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
            Hapus
          </button>
          <button type="button" @click="cancelDelete" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Batal
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-900">Daftar Supplier</h2>
        <Link :href="route('admin.suppliers.create')"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
        <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Tambah Supplier
        </Link>
      </div>

      <!-- Flash Messages -->
      <div v-if="$page.props.flash?.success" class="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
        role="alert">
        <p class="font-bold">Sukses!</p>
        <p>{{ $page.props.flash.success }}</p>
      </div>

      <div v-if="$page.props.flash?.error" class="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
        role="alert">
        <p class="font-bold">Error!</p>
        <p>{{ $page.props.flash.error }}</p>
      </div>

      <!-- Suppliers Table -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Informasi Supplier</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontak</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat</th>
                <th scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                <th scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(supplier, index) in suppliers?.data || []" :key="supplier.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  <span class="px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                    {{ (suppliers?.from || 1) + index }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                      {{ supplier.nama ? supplier.nama.charAt(0).toUpperCase() : 'S' }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ supplier.nama || '-' }}</div>
                      <div v-if="supplier.deskripsi" class="text-sm text-gray-500 mt-1">
                        {{ supplier.deskripsi.length > 40 ? supplier.deskripsi.substring(0, 40) + '...' :
                        supplier.deskripsi }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="supplier.telepon" class="flex items-center text-sm text-gray-900">
                    <svg class="h-4 w-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">
                      </path>
                    </svg>
                    <a :href="'https://wa.me/' + supplier.telepon"
                      class="text-indigo-600 hover:text-indigo-900 hover:underline" target="_blank">
                      {{ supplier.telepon }}
                    </a>
                  </div>
                  <span v-else class="text-sm text-gray-500">-</span>
                </td>
                <td class="px-6 py-4">
                  <div v-if="supplier.alamat" class="text-sm text-gray-900 max-w-xs truncate flex items-start"
                    :title="supplier.alamat">
                    <svg class="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>
                      {{ supplier.alamat.length > 40 ? supplier.alamat.substring(0, 40) + '...' : supplier.alamat }}
                    </span>
                  </div>
                  <span v-else class="text-sm text-gray-500">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {{ supplier.product_count || 0 }} Produk
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-center space-x-2">
                    <Link :href="route('admin.suppliers.show', supplier.id)"
                      class="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-md hover:bg-indigo-50" title="Detail">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                      </path>
                    </svg>
                    </Link>
                    <Link :href="route('admin.suppliers.edit', supplier.id)"
                      class="text-yellow-600 hover:text-yellow-900 p-1.5 rounded-md hover:bg-yellow-50" title="Edit">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                      </path>
                    </svg>
                    </Link>
                    <button @click="showDeleteConfirmation(supplier)"
                      class="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50"
                      :disabled="isDeleting">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="!suppliers?.data || suppliers.data.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                  <div class="text-gray-500">
                      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M20 7l-8-4.5L4 7m16 0l-8 4.5M4 7v9.5l8 4.5m0-14l8 4.5M4 16.5l8 4.5"></path>
                      </svg>
                    <p class="text-sm font-medium">Belum ada supplier yang tersedia.</p>
                    <p class="text-xs text-gray-400 mt-1">Klik tombol "Tambah Supplier" untuk menambah supplier baru.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <Pagination v-if="suppliers?.links" :links="suppliers.links" class="px-6 py-4" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import Pagination from '@/Components/Pagination.vue';

// Component props
defineOptions({
  layout: AdminLayout,
});

const props = defineProps({
  suppliers: {
    type: Object,
    required: true,
    default: () => ({ data: [], links: [] })
  },
  filters: {
    type: Object,
    default: () => ({})
  },
  flash: {
    type: Object,
    default: () => ({})
  }
});

// State for delete confirmation modal
const showDeleteModal = ref(false);
const supplierToDelete = ref(null);
const isDeleting = ref(false);

// Initialize toast if available
onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      import('vue3-toastify').then(module => {
        window.toast = module.toast;
        import('vue3-toastify/dist/index.css');
      });
    } catch (e) {
      console.warn('Toast library not available, using fallback');
    }
  }

  // Show flash messages on mount
  if (props.flash) {
    if (props.flash.success) {
      showToast(props.flash.success, 'success');
    } else if (props.flash.error) {
      showToast(props.flash.error, 'error');
    } else if (props.flash.warning) {
      showToast(props.flash.warning, 'warning');
    } else if (props.flash.info) {
      showToast(props.flash.info, 'info');
    }
  }
});

// Toast notification function
const showToast = (message, type = 'info', options = {}) => {
  // Using vue3-toastify if available, fallback to browser alert
  if (window.toast) {
    const toastOptions = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
      ...options
    };
    
    switch (type) {
      case 'success':
        window.toast.success(message, toastOptions);
        break;
      case 'error':
        window.toast.error(message, { ...toastOptions, autoClose: 5000 });
        break;
      case 'warning':
        window.toast.warn(message, { ...toastOptions, autoClose: 4000 });
        break;
      case 'info':
        window.toast.info(message, toastOptions);
        break;
      default:
        window.toast(message, toastOptions);
    }
  } else {
    const icons = {
      success: '✓',
      error: '✗',
      info: 'ℹ',
      warning: '⚠'
    };
    alert(`${icons[type] || '•'} ${message}`);
  }
};

// Delete confirmation methods
const showDeleteConfirmation = (supplier) => {
  supplierToDelete.value = supplier;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  supplierToDelete.value = null;
};

const confirmDelete = () => {
  if (supplierToDelete.value) {
    deleteSupplier(supplierToDelete.value);
  }
};

const deleteSupplier = (supplier) => {
  if (isDeleting.value) return;
  
  isDeleting.value = true;
  
  // Using POST with _method=DELETE for better compatibility
  router.post(route('admin.suppliers.destroy', supplier.id), {
    _method: 'DELETE'
  }, {
    preserveScroll: true,
    onSuccess: () => {
      showToast('Supplier berhasil dihapus', 'success');
      supplierToDelete.value = null;
    },
    onError: (errors) => {
      console.error('Gagal menghapus supplier:', errors);
      const errorMessage = errors?.message || 'Gagal menghapus supplier. Silakan coba lagi.';
      showToast(errorMessage, 'error');
    },
    onFinish: () => {
      isDeleting.value = false;
      showDeleteModal.value = false;
    }
  });
};
</script>