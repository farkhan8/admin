<template>
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">Edit Supplier: {{ supplier.nama }}</h2>
          <Link 
            :href="route('admin.suppliers.index')" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Kembali ke Daftar Supplier
          </Link>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <form @submit.prevent="submit">
              <div class="space-y-6">
                <div>
                  <label for="nama" class="block text-sm font-medium text-gray-700">Nama Supplier <span class="text-red-500">*</span></label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="nama" 
                      v-model="form.nama" 
                      required
                      :class="{'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500': form.errors.nama}"
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                    <p v-if="form.errors.nama" class="mt-2 text-sm text-red-600">{{ form.errors.nama }}</p>
                  </div>
                </div>

                <div>
                  <label for="telepon" class="block text-sm font-medium text-gray-700">Telepon <span class="text-red-500">*</span></label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="telepon" 
                      v-model="form.telepon" 
                      required
                      :class="{'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500': form.errors.telepon}"
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                    <p v-if="form.errors.telepon" class="mt-2 text-sm text-red-600">{{ form.errors.telepon }}</p>
                  </div>
                </div>

                <div>
                  <label for="alamat" class="block text-sm font-medium text-gray-700">Alamat <span class="text-red-500">*</span></label>
                  <div class="mt-1">
                    <textarea 
                      id="alamat" 
                      rows="3" 
                      v-model="form.alamat" 
                      required
                      :class="{'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500': form.errors.alamat}"
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                    <p v-if="form.errors.alamat" class="mt-2 text-sm text-red-600">{{ form.errors.alamat }}</p>
                  </div>
                </div>

                <div>
                  <label for="deskripsi" class="block text-sm font-medium text-gray-700">Deskripsi</label>
                  <div class="mt-1">
                    <textarea 
                      id="deskripsi" 
                      rows="3" 
                      v-model="form.deskripsi"
                      :class="{'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500': form.errors.deskripsi}"
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                    <p v-if="form.errors.deskripsi" class="mt-2 text-sm text-red-600">{{ form.errors.deskripsi }}</p>
                  </div>
                </div>

                <div class="flex items-center justify-end space-x-3 pt-4">
                  <Link 
                    :href="route('admin.suppliers.index')" 
                    class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Batal
                  </Link>
                  <button 
                    type="submit" 
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    :disabled="form.processing"
                    :class="{'opacity-50 cursor-not-allowed': form.processing}"
                  >
                    <svg v-if="!form.processing" class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span v-if="form.processing">Menyimpan...</span>
                    <span v-else>Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3';
import { Link } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
defineOptions({
  layout: AdminLayout
});

const props = defineProps({
  supplier: {
    type: Object,
    required: true
  }
});

const form = useForm({
  nama: props.supplier.nama,
  telepon: props.supplier.telepon,
  alamat: props.supplier.alamat,
  deskripsi: props.supplier.deskripsi || ''
});

const submit = () => {
  form.transform((data) => {
    // Transform the data to FormData if needed for file uploads
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    formData.append('_method', 'PUT');
    return formData;
  }).post(route('admin.suppliers.update', props.supplier.id), {
    onSuccess: () => {
      // Success handling
    },
    onError: (errors) => {
      console.error('Error updating supplier:', errors);
    },
    preserveScroll: true,
    preserveState: true
  });
};
</script>
