<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="errorMessage" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div class="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p class="font-bold">Error!</p>
          <p>{{ errorMessage }}</p>
        </div>
        <button 
          @click="refreshPage"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>
    </div>
    
    <!-- Main Content -->
    <div v-else>
      <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-gray-900">Daftar Kategori</h2>
            <Link 
              :href="route('admin.categories.create')" 
              class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Tambah Kategori
            </Link>
          </div>

          <!-- Flash Messages -->
          <div v-if="$page.props.flash?.success" class="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
            <p class="font-bold">Success!</p>
            <p>{{ $page.props.flash.success }}</p>
          </div>

          <div v-if="$page.props.flash?.error" class="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p class="font-bold">Error!</p>
            <p>{{ $page.props.flash.error }}</p>
          </div>


          <!-- Delete Confirmation Modal -->
          <div v-if="pendingDelete" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="cancelDelete">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
              <div class="mt-3 text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">Hapus Kategori</h3>
                <div class="mt-2 px-7 py-3">
                  <p class="text-sm text-gray-500">
                    Apakah Anda yakin ingin menghapus kategori <strong>"{{ pendingDelete.nama }}"</strong>?
                    <br><span class="text-xs text-red-500 mt-1 block">Tindakan ini tidak dapat dibatalkan.</span>
                  </p>
                </div>
                <div class="flex justify-center space-x-3 mt-4">
                  <button 
                    @click="cancelDelete" 
                    class="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    @click="proceedWithDelete" 
                    class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Categories Table -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gambar
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Kategori
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah Produk
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Stok
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <!-- Categories Data -->
                  <tr v-for="kategori in computedKategoris.data" :key="kategori.id || kategori.nama">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div v-if="kategori.gambar" class="h-10 w-10 rounded-md overflow-hidden">
                        <img 
                          :src="getImageUrl(kategori.gambar)" 
                          :alt="kategori.nama" 
                          class="h-full w-full object-cover"
                          @error="handleImageError"
                        >
                      </div>
                      <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="rounded-full bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-semibold">
                        {{ kategori.nama || 'Tidak ada nama' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {{ kategori.jumlah_produk || 0 }} Produk
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {{ kategori.jumlah_stock || kategori.total_stock || 0 }} Stok
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex space-x-2">
                        <Link 
                          :href="route('admin.categories.edit', kategori.id)" 
                          class="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </Link>
                        <button 
                          @click="confirmDelete(kategori)"
                          class="text-red-600 hover:text-red-900" 
                          title="Hapus"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Empty State -->
                  <tr v-if="computedKategoris.data.length === 0">
                    <td colspan="5" class="px-6 py-8 text-center">
                      <div class="text-gray-500">
                        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                        <p class="text-sm font-medium">Belum ada kategori yang tersedia.</p>
                        <p class="text-xs text-gray-400 mt-1">Klik tombol "Tambah Kategori" untuk menambah kategori baru.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <Pagination 
              v-if="computedKategoris.links && computedKategoris.links.length > 0" 
              :links="computedKategoris.links" 
              class="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Link, useForm, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import Pagination from '@/Components/Pagination.vue';
import { ref, onMounted, computed, watch, nextTick } from 'vue';

// Toast functionality - using try-catch for safer import handling
let toast = null;
try {
  // Try to import toast if available
  if (typeof window !== 'undefined' && window.toast) {
    toast = window.toast;
  } else {
    // Import vue3-toastify synchronously if possible
    const { toast: toastFn } = require('vue3-toastify');
    toast = toastFn;
  }
} catch (error) {
  console.warn('Toast module not available, using fallback');
}

// Fallback toast functions
const showToast = {
  success: (message) => {
    if (toast && toast.success) {
      toast.success(message, {
        position: 'top-right',
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: 'button',
        icon: true,
        rtl: false
      });
    } else {
      console.log('SUCCESS:', message);
      // Fallback jika toast tidak tersedia
      const toastEl = document.createElement('div');
      toastEl.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg';
      toastEl.textContent = message;
      document.body.appendChild(toastEl);
      setTimeout(() => {
        document.body.removeChild(toastEl);
      }, 5000);
    }
  },
  error: (message) => {
    if (toast && toast.error) {
      toast.error(message, {
        position: 'top-right',
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: 'button',
        icon: true,
        rtl: false
      });
    } else {
      console.error('ERROR:', message);
      // Fallback jika toast tidak tersedia
      const toastEl = document.createElement('div');
      toastEl.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg';
      toastEl.textContent = message;
      document.body.appendChild(toastEl);
      setTimeout(() => {
        document.body.removeChild(toastEl);
      }, 5000);
    }
  },
  info: (message) => {
    if (toast && toast.info) {
      toast.info(message, {
        position: 'top-right',
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: 'button',
        icon: true,
        rtl: false
      });
    } else {
      console.log('INFO:', message);
      // Fallback jika toast tidak tersedia
      const toastEl = document.createElement('div');
      toastEl.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg';
      toastEl.textContent = message;
      document.body.appendChild(toastEl);
      setTimeout(() => {
        document.body.removeChild(toastEl);
      }, 5000);
    }
  }
};

defineOptions({
    layout: AdminLayout,
});

const props = defineProps({
  kategoris: {
    type: [Object, Array],
    required: true,
    default: () => ({})
  },
  error: {
    type: String,
    default: null
  }
});

// Reactive variables
const loading = ref(true);
const errorMessage = ref(props.error);
const showDebug = ref(false);

// Debug info
const debugInfo = computed(() => {
  return JSON.stringify({
    propsKategoris: props.kategoris,
    propsError: props.error,
    hasData: !!props.kategoris?.data,
    dataLength: props.kategoris?.data?.length || 0,
    dataType: typeof props.kategoris,
    isArray: Array.isArray(props.kategoris),
    hasLinks: !!props.kategoris?.links,
    linksLength: props.kategoris?.links?.length || 0,
    pageProps: typeof window !== 'undefined' && window.$page ? window.$page.props : 'Not available'
  }, null, 2);
});

// Improved computed kategoris with better error handling
const computedKategoris = computed(() => {
  try {
    console.log('Computing kategoris from props:', props.kategoris);

    // If kategoris is null or undefined
    if (!props.kategoris) {
      console.warn('kategoris prop is null or undefined');
      return {
        data: [],
        links: [],
        meta: { total: 0 }
      };
    }

    // If kategoris is already an array (direct data)
    if (Array.isArray(props.kategoris)) {
      console.log('kategoris is array with length:', props.kategoris.length);
      return {
        data: props.kategoris,
        links: [],
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          path: '',
          per_page: props.kategoris.length,
          to: props.kategoris.length,
          total: props.kategoris.length
        }
      };
    }
    
    // If kategoris is an object with data property (paginated)
    if (props.kategoris && typeof props.kategoris === 'object' && 'data' in props.kategoris) {
      console.log('kategoris is paginated object with data length:', props.kategoris.data?.length || 0);
      console.log('kategoris links:', props.kategoris.links);
      console.log('kategoris meta:', props.kategoris.meta);
      
      return {
        data: Array.isArray(props.kategoris.data) ? props.kategoris.data : [],
        links: props.kategoris.links || [],
        meta: props.kategoris.meta || {
          current_page: 1,
          from: 1,
          last_page: 1,
          path: '',
          per_page: 15,
          to: props.kategoris.data?.length || 0,
          total: props.kategoris.data?.length || 0
        }
      };
    }
    
    // If kategoris is an object but not in expected format
    console.warn('kategoris object in unexpected format:', props.kategoris);
    return {
      data: [],
      links: [],
      meta: { total: 0 }
    };
    
  } catch (error) {
    console.error('Error in computedKategoris:', error);
    errorMessage.value = 'Error processing categories data: ' + error.message;
    return {
      data: [],
      links: [],
      meta: { total: 0 }
    };
  }
});

// Helper functions
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  return imagePath.startsWith('http') ? imagePath : `/storage/${imagePath}`;
};

const handleImageError = (event) => {
  console.warn('Image failed to load:', event.target.src);
  event.target.style.display = 'none';
};

const refreshPage = () => {
  window.location.reload();
};

// Lifecycle
onMounted(() => {
  console.log('Component mounted');
  console.log('Raw props:', { kategoris: props.kategoris, error: props.error });
  
  nextTick(() => {
    // Set loading to false after a small delay to ensure everything is rendered
    setTimeout(() => {
      loading.value = false;
      console.log('Loading set to false');
      console.log('Computed kategoris:', computedKategoris.value);
    }, 100);
  });
  
  // Check for errors
  if (errorMessage.value) {
    console.error('Error from server:', errorMessage.value);
    showToast.error('Gagal memuat data kategori: ' + errorMessage.value);
  }
});

// Watchers
watch(() => props.kategoris, (newVal, oldVal) => {
  console.log('kategoris prop changed from:', oldVal, 'to:', newVal);
}, { deep: true, immediate: true });

watch(() => computedKategoris.value, (newVal) => {
  console.log('computedKategoris changed:', newVal);
}, { deep: true });

// Delete functionality
const deleteForm = useForm({});
const pendingDelete = ref(null); // Store category pending deletion

const confirmDelete = (kategori) => {
  if (!kategori || !kategori.id) {
    console.error('Invalid kategori object:', kategori);
    showToast.error('Data kategori tidak valid');
    return;
  }
  
  // Store the category to be deleted and show modal
  pendingDelete.value = kategori;
};

const proceedWithDelete = () => {
  const kategori = pendingDelete.value;
  
  if (!kategori || !kategori.id) {
    showToast.error('Data kategori tidak valid');
    return;
  }
  
  // Gunakan POST dengan method spoofing untuk kompatibilitas yang lebih baik
  router.post(route('admin.categories.destroy', kategori.id), {
    _method: 'DELETE'
  }, {
    preserveScroll: true,
    onSuccess: () => {
      showToast.success(`Kategori "${kategori.nama}" berhasil dihapus`);
      pendingDelete.value = null;
    },
    onError: (errors) => {
      console.error('Error deleting category:', errors);
      showToast.error('Gagal menghapus kategori: ' + (errors.message || 'Terjadi kesalahan'));
      pendingDelete.value = null;
    }
  });
};

const cancelDelete = () => {
  pendingDelete.value = null;
};
</script>