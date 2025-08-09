<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    
    <!-- Main Content -->
    <div v-else class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">
            Edit Kategori: {{ form.nama || 'Loading...' }}
          </h2>
          <Link 
            :href="route('admin.categories.index')" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Kembali ke Daftar
          </Link>
        </div>

        <!-- Error Summary -->
        <div v-if="hasErrors" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Terdapat {{ errorCount }} kesalahan pada saat mengisi form:
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <ul class="list-disc pl-5 space-y-1">
                  <li v-for="(error, key) in pageErrors" :key="key">
                    {{ error }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Debug Info -->
        <div v-if="showDebug" class="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p class="font-bold">Debug Info:</p>
          <pre class="text-xs mt-2 whitespace-pre-wrap">{{ debugInfo }}</pre>
          <button @click="showDebug = false" class="mt-2 text-xs underline">Hide Debug</button>
        </div>

        <!-- Form -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <form @submit.prevent="submitForm" enctype="multipart/form-data">
            <div class="px-4 py-5 sm:p-6">
              <div class="space-y-6">
                <!-- Nama Kategori -->
                <div>
                  <label for="nama" class="block text-sm font-medium text-gray-700">
                    Nama Kategori <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="nama"
                      v-model="form.nama"
                      :class="{
                        'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500': form.errors.nama,
                        'focus:ring-indigo-500 focus:border-indigo-500': !form.errors.nama
                      }"
                      class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Contoh: Makanan Ringan"
                      :disabled="form.processing"
                    >
                  </div>
                  <p v-if="form.errors.nama" class="mt-2 text-sm text-red-600">
                    {{ form.errors.nama }}
                  </p>
                </div>

                <!-- Gambar Kategori -->
                <div>
                  <label for="gambar" class="block text-sm font-medium text-gray-700">
                    Gambar Kategori
                  </label>
                  <div class="mt-1 flex items-center">
                    <!-- Current/Preview Image -->
                    <span class="h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                      <img 
                        v-if="displayImage" 
                        :src="displayImage" 
                        :alt="category?.nama || 'Category image'" 
                        class="h-full w-full object-cover"
                        @error="handleImageError"
                      >
                      <svg 
                        v-else 
                        class="h-full w-full text-gray-300" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    
                    <!-- File Upload Button -->
                    <div class="ml-4">
                      <label 
                        for="gambar" 
                        class="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        :class="{ 'opacity-50 cursor-not-allowed': form.processing }"
                      >
                        Ganti Gambar
                      </label>
                      <input 
                        id="gambar" 
                        name="gambar" 
                        type="file" 
                        class="sr-only" 
                        accept="image/*" 
                        @change="onFileChange"
                        :disabled="form.processing"
                      >
                    </div>
                  </div>
                  
                  <!-- File Info -->
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Biarkan kosong jika tidak ingin mengubah gambar. Format: JPG, PNG, GIF (Maks. 2MB)
                    </p>
                    <p v-if="selectedFileName" class="text-sm text-green-600 mt-1">
                      File baru terpilih: {{ selectedFileName }}
                    </p>
                    <p v-else-if="category?.gambar" class="text-sm text-blue-600 mt-1">
                      Gambar saat ini: {{ category.gambar }}
                    </p>
                  </div>
                  
                  <p v-if="form.errors.gambar" class="mt-2 text-sm text-red-600">
                    {{ form.errors.gambar }}
                  </p>
                </div>

                <!-- Info Notice -->
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-yellow-700">
                        <span class="font-medium">Informasi:</span> 
                        Jumlah produk dan stok dihitung otomatis berdasarkan produk yang terkait dengan kategori ini.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Category Stats (if available) -->
                <div v-if="category" class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Statistik Kategori</h4>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">Jumlah Produk:</span>
                      <span class="font-medium ml-1">{{ category.jumlah_produk || 0 }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Total Stok:</span>
                      <span class="font-medium ml-1">{{ category.jumlah_stock || category.total_stock || 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Form Actions -->
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
              <Link 
                :href="route('admin.categories.index')" 
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                :class="{ 'opacity-50 cursor-not-allowed': form.processing }"
              >
                <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Batal
              </Link>
              
              <button 
                type="submit" 
                :disabled="form.processing || !canSubmit"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg 
                  v-if="form.processing" 
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ form.processing ? 'Memperbarui...' : 'Perbarui Kategori' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Debug Button -->
        <div class="mt-4 text-center">
          <button 
            @click="showDebug = !showDebug"
            class="text-xs text-gray-500 underline"
          >
            {{ showDebug ? 'Hide' : 'Show' }} Debug Info
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useForm, Link } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineOptions({
    layout: AdminLayout,
});

const props = defineProps({
  category: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

// Reactive variables
const loading = ref(true);
const imagePreview = ref(null);
const selectedFileName = ref('');
const showDebug = ref(process.env.NODE_ENV === 'development');

// Form setup
const form = useForm({
  nama: props.category?.nama || '',
  gambar: null,
});

// Computed properties
const pageErrors = computed(() => {
  if (typeof window !== 'undefined' && window.$page?.props?.errors) {
    return window.$page.props.errors;
  }
  return {};
});

const hasErrors = computed(() => {
  return Object.keys(pageErrors.value).length > 0;
});

const errorCount = computed(() => {
  return Object.keys(pageErrors.value).length;
});

const canSubmit = computed(() => {
  return form.nama.trim() !== '';
});

const displayImage = computed(() => {
  if (imagePreview.value) {
    return imagePreview.value;
  }
  if (props.category?.gambar) {
    return `/storage/${props.category.gambar}`;
  }
  return null;
});

const category = computed(() => {
  return props.category || {};
});

const debugInfo = computed(() => ({
  formData: {
    nama: form.nama,
    gambar: form.gambar ? `File: ${form.gambar.name} (${form.gambar.size / 1024} KB)` : 'No file',
    hasFile: !!form.gambar
  },
  errors: form.errors
}));

// Methods
const onFileChange = (event) => {
  try {
    const file = event.target.files[0];
    
    if (file) {
      // Validate file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Ukuran file terlalu besar. Maksimal 2MB.');
        event.target.value = '';
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format file tidak didukung. Gunakan JPG, PNG, atau GIF.');
        event.target.value = '';
        return;
      }

      form.gambar = file;
      selectedFileName.value = file.name;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target.result;
      };
      reader.onerror = (e) => {
        console.error('Error reading file:', e);
        alert('Error membaca file. Coba pilih file lain.');
      };
      reader.readAsDataURL(file);
    } else {
      form.gambar = null;
      selectedFileName.value = '';
      imagePreview.value = null;
    }
  } catch (error) {
    console.error('Error in onFileChange:', error);
    alert('Error memproses file. Coba lagi.');
  }
};

const handleImageError = (event) => {
  console.warn('Image failed to load:', event.target.src);
  event.target.style.display = 'none';
};

const submitForm = () => {
  if (!canSubmit.value) {
    alert('Harap isi nama kategori.');
    return;
  }

  if (!props.category?.id) {
    alert('ID kategori tidak ditemukan.');
    return;
  }

  // Use PUT method for updates, but Laravel needs _method field for file uploads
  form.transform((data) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('nama', data.nama);
    
    // Only append file if a new one was selected
    if (data.gambar && data.gambar instanceof File) {
      formData.append('gambar', data.gambar);
    }
    
    return formData;
  }).post(route('admin.categories.update', props.category.id), {
    preserveScroll: true,
    onSuccess: () => {
      console.log('Edit form submitted successfully');
      // Reset only the file input, keep the name
      form.gambar = null;
      selectedFileName.value = '';
      imagePreview.value = null;
    },
    onError: (errors) => {
      console.error('Edit form submission errors:', errors);
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onFinish: () => {
      console.log('Edit form submission finished');
    }
  });
};

// Lifecycle
onMounted(() => {
  // Initialize form with category data
  if (props.category) {
    form.nama = props.category.nama || '';
    form._method = 'PUT';
    
    if (props.category.gambar) {
      // Set the image preview if there's an existing image
      imagePreview.value = props.category.gambar;
    }
  }
  
  // Set loading to false after a small delay to ensure everything is rendered
  setTimeout(() => {
    loading.value = false;
  }, 100);
});
</script>