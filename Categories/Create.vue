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
          <h2 class="text-2xl font-semibold text-gray-900">Tambah Kategori Baru</h2>
          <Link :href="route('admin.categories.index')"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
            fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd" />
          </svg>
          Kembali ke Kategori
          </Link>
        </div>

        <!-- Error Summary -->
        <div v-if="hasErrors" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd" />
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

        <!-- Toast Notification -->
        <div v-if="showToast" class="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div :class="{
            'bg-green-100 border-green-500 text-green-700': toastType === 'success',
            'bg-red-100 border-red-500 text-red-700': toastType === 'error',
            'bg-yellow-100 border-yellow-500 text-yellow-700': toastType === 'warning'
          }" class="border-l-4 p-4 rounded shadow-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <!-- Success Icon -->
                <svg v-if="toastType === 'success'" class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <!-- Warning Icon -->
                <svg v-else-if="toastType === 'warning'" class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <!-- Error Icon -->
                <svg v-else class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium">{{ toastMessage }}</p>
              </div>
              <div class="ml-4 flex-shrink-0">
                <button @click="closeToast" class="inline-flex text-sm font-medium hover:opacity-75">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
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
                    <input type="text" id="nama" v-model="form.nama" :class="{
                      'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500': form.errors.nama,
                      'focus:ring-indigo-500 focus:border-indigo-500': !form.errors.nama
                    }" class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Contoh: Makanan Ringan" :disabled="form.processing">
                  </div>
                  <p v-if="form.errors.nama" class="mt-2 text-sm text-red-600">
                    {{ form.errors.nama }}
                  </p>
                </div>

                <!-- Gambar Kategori -->
                <div>
                  <label for="gambar" class="block text-sm font-medium text-gray-700">
                    Gambar Kategori <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1 flex items-center">
                    <!-- Image Preview -->
                    <span class="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                      <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="h-full w-full object-cover">
                      <svg v-else class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>

                    <!-- File Upload Button -->
                    <div class="ml-4">
                      <label for="gambar"
                        class="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        :class="{ 'opacity-50 cursor-not-allowed': form.processing }">
                        {{ form.gambar ? 'Ganti Gambar' : 'Pilih Gambar' }}
                      </label>
                      <input ref="fileInputRef" id="gambar" name="gambar" type="file" class="sr-only" accept="image/*"
                        @change="onFileChange" :disabled="form.processing">
                    </div>
                  </div>

                  <!-- File Info -->
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">Format: JPG, PNG, GIF (Maks. 2MB)</p>
                    <p v-if="selectedFileName" class="text-sm text-green-600 mt-1">
                      File terpilih: {{ selectedFileName }}
                    </p>
                  </div>

                  <p v-if="form.errors.gambar" class="mt-2 text-sm text-red-600">
                    {{ form.errors.gambar }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
              <Link :href="route('admin.categories.index')"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                :class="{ 'opacity-50 cursor-not-allowed': form.processing }">
              <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
              Batal
              </Link>

              <button type="submit" :disabled="form.processing || !canSubmit"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="form.processing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                {{ form.processing ? 'Menyimpan...' : 'Simpan Kategori' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Debug Button -->
        <div class="mt-4 text-center">
          <button @click="showDebug = !showDebug" class="text-xs text-gray-500 underline">
            {{ showDebug ? 'Hide' : 'Show' }} Debug Info
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useForm, Link, router } from '@inertiajs/vue3';

// Define props
const props = defineProps({
  flash: {
    type: Object,
    default: () => ({
      success: null,
      error: null,
      warning: null,
      info: null
    })
  }
});
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineOptions({
  layout: AdminLayout,
});

// Reactive variables
const loading = ref(true);
const imagePreview = ref(null);
const selectedFileName = ref('');
const showDebug = ref(process.env.NODE_ENV === 'development');
const fileInputRef = ref(null);

// Toast notification variables
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success'); // 'success' or 'error'

// Form setup
const form = useForm({
  nama: '',
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
  const fileInput = fileInputRef.value;
  const hasFile = fileInput?.files?.[0] || form.gambar;
  return form.nama.trim() !== '' && hasFile;
});

const debugInfo = computed(() => ({
  formData: {
    nama: form.nama,
    gambar: form.gambar ? `File: ${form.gambar.name} (${(form.gambar.size / 1024).toFixed(2)} KB)` : 'No file',
    hasFile: !!form.gambar
  },
  errors: form.errors
}));

// Methods
const onFileChange = (event) => {
  try {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (2MB = 2048KB)
      const maxSize = 2048 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        showToastNotification('Ukuran file terlalu besar. Maksimal 2MB.', 'error');
        event.target.value = '';
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToastNotification('File harus berupa gambar (JPG, PNG, GIF).', 'error');
        event.target.value = '';
        return;
      }

      // Store file in form
      form.gambar = file;
      selectedFileName.value = file.name;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target.result;
      };
      reader.onerror = (e) => {
        console.error('Error reading file:', e);
        showToastNotification('Error membaca file. Coba pilih file lain.', 'error');
      };
      reader.readAsDataURL(file);
    } else {
      form.gambar = null;
      selectedFileName.value = '';
      imagePreview.value = null;
    }
  } catch (error) {
    console.error('Error in onFileChange:', error);
    showToastNotification('Error memproses file. Coba lagi.', 'error');
  }
};

const submitForm = () => {
  const fileInput = fileInputRef.value;
  const selectedFile = fileInput?.files?.[0] || null;

  if (!form.nama.trim() || !selectedFile) {
    showToastNotification('Harap isi semua field yang diperlukan.', 'error');
    return;
  }

  // Show immediate feedback
  showToastNotification('Sedang menyimpan kategori...', 'warning');

  // Create FormData directly using the file from input element
  const formData = new FormData();
  formData.append('nama', form.nama);

  if (selectedFile && selectedFile instanceof File) {
    formData.append('gambar', selectedFile);
  }

  // Set processing state manually
  form.processing = true;
  form.errors = {};

  // Use native fetch API to bypass any Inertia.js file upload issues
  fetch(route('admin.categories.store'), {
    method: 'POST',
    body: formData,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    }
  })
  .then(response => {
    if (response.ok) {
      return { success: true, message: 'Kategori berhasil dibuat!' };
    } else {
      return response.json().then(data => {
        throw new Error(JSON.stringify(data));
      }).catch(() => {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      });
    }
  })
  .then(data => {
    showToastNotification('Kategori berhasil dibuat!', 'success');

    // Reset form
    form.reset();
    imagePreview.value = null;
    selectedFileName.value = '';
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
    form.processing = false;

    // Redirect to categories index
    setTimeout(() => {
      router.visit(route('admin.categories.index'));
    }, 1000);
  })
  .catch(error => {
    let errorData = {};
    try {
      errorData = JSON.parse(error.message);
    } catch (e) {
      errorData = { error: error.message };
    }

    // Set form errors
    form.errors = errorData.errors || errorData;

    // Show specific error message
    let errorMessage = 'Terjadi kesalahan saat menyimpan kategori.';
    if (errorData.errors?.gambar) {
      errorMessage = Array.isArray(errorData.errors.gambar) ? errorData.errors.gambar[0] : errorData.errors.gambar;
    } else if (errorData.errors?.nama) {
      errorMessage = Array.isArray(errorData.errors.nama) ? errorData.errors.nama[0] : errorData.errors.nama;
    } else if (errorData.error) {
      errorMessage = errorData.error;
    } else if (errorData.message) {
      errorMessage = errorData.message;
    }

    showToastNotification(errorMessage, 'error');
    form.processing = false;
  })
  .finally(() => {
    console.log('Form submission finished');
  });
};

// Toast notification functions
const showToastNotification = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  // Auto hide after 5 seconds
  setTimeout(() => {
    showToast.value = false;
  }, 5000);
};

const closeToast = () => {
  showToast.value = false;
};

// Lifecycle
onMounted(() => {
  // Check for flash messages
  if (props?.flash?.success) {
    showToastNotification(props.flash.success, 'success');
  } else if (props?.flash?.error) {
    showToastNotification(props.flash.error, 'error');
  }

  // Set loading to false after a small delay to ensure everything is rendered
  setTimeout(() => {
    loading.value = false;
  }, 100);
});
</script>