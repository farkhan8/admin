<template>
    <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Detail Supplier</h1>
          </div>
          <div class="flex space-x-3">
            <Link 
              :href="route('admin.suppliers.edit', supplier.id)" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit
            </Link>
            <button 
              type="button" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              @click="showDeleteModal = true"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <!-- Supplier Information -->
        <div class="px-6 py-5">
          <h2 class="text-lg font-medium text-gray-900 mb-6 pb-4 border-b border-gray-200">Informasi Supplier</h2>
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div class="space-y-1">
              <dt class="text-sm font-medium text-gray-500">Nama Supplier</dt>
              <dd class="text-base text-gray-900 font-medium">{{ supplier.nama }}</dd>
            </div>
            <div class="space-y-1">
              <dt class="text-sm font-medium text-gray-500">Telepon</dt>
              <dd class="text-base">
                <a :href="'https://wa.me/' + supplier.telepon" class="text-indigo-600 hover:text-indigo-800 hover:underline"
                  target="_blank" rel="noopener noreferrer">
                  {{ supplier.telepon || '-' }}
                </a>
              </dd>
            </div>
            <div class="space-y-1">
              <dt class="text-sm font-medium text-gray-500">Jumlah Produk</dt>
              <dd class="text-base">
                <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                  {{ supplier.product_count || 0 }} Produk
                </span>
              </dd>
            </div>
            <div class="space-y-1">
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="text-base">
                <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Aktif
                </span>
              </dd>
            </div>
          </div>
          
          <div class="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <div class="space-y-1">
              <dt class="text-sm font-medium text-gray-500">Alamat</dt>
              <dd class="text-base text-gray-900">{{ supplier.alamat || '-' }}</dd>
            </div>
            <div v-if="supplier.deskripsi" class="space-y-1">
              <dt class="text-sm font-medium text-gray-500">Deskripsi</dt>
              <dd class="text-base text-gray-700 bg-gray-50 p-3 rounded-md">{{ supplier.deskripsi }}</dd>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div class="mt-6">
        <div class="bg-white shadow overflow-hidden rounded-lg">
          <div class="px-6 py-5 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-900">Daftar Produk</h2>
              <span class="text-sm text-gray-500">Total: {{ supplier.product_count || 0 }} produk</span>
            </div>
          </div>
          
          <div class="px-6 py-4">
            <div v-if="supplier.produks && supplier.produks.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="produk in supplier.produks" :key="produk.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex-shrink-0 h-16 w-16">
                        <img v-if="produk.gambar" :src="'/storage/' + produk.gambar" :alt="'Gambar ' + produk.nama" class="h-full w-full object-cover rounded">
                        <div v-else class="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 rounded">
                          <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ produk.nama }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {{ produk.kategori?.nama || 'Tidak Berkategori' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {{ formatRupiah(produk.harga) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {{ produk.stok || 0 }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        :class="{
                          'bg-green-100 text-green-800': produk.stok > 0,
                          'bg-yellow-100 text-yellow-800': produk.stok === 0,
                          'bg-red-100 text-red-800': produk.stok < 0
                        }">
                        {{ produk.stok > 0 ? 'Tersedia' : produk.stok === 0 ? 'Habis' : 'Stok Invalid' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-else class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada produk</h3>
              <p class="mt-1 text-sm text-gray-500">Belum ada produk yang terdaftar untuk supplier ini.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <!-- Footer -->
      <div class="mt-6 flex justify-end">
        <Link 
          :href="route('admin.suppliers.index')" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Kembali ke Daftar Supplier
        </Link>
      </div>

      <!-- Delete Confirmation Modal -->
      <ConfirmationModal :show="showDeleteModal" @close="showDeleteModal = false">
        <template #title>
          Hapus Supplier
        </template>

        <template #content>
          <p>Apakah Anda yakin ingin menghapus supplier <strong>{{ supplier.nama }}</strong>?</p>
          <div v-if="supplier.product_count > 0" class="mt-4 p-4 bg-yellow-50 text-yellow-700 rounded-md">
            <p class="font-medium">Peringatan!</p>
            <p class="text-sm mt-1">
              Terdapat {{ supplier.product_count }} produk yang terkait dengan supplier ini. 
              Menghapus supplier akan mempengaruhi produk terkait.
            </p>
          </div>
        </template>

        <template #footer>
          <SecondaryButton @click="showDeleteModal = false">
            Batal
          </SecondaryButton>

          <DangerButton 
            class="ml-3" 
            :class="{ 'opacity-25': deleteProcessing }" 
            :disabled="deleteProcessing"
            @click="deleteSupplier"
          >
            <span v-if="deleteProcessing">Menghapus...</span>
            <span v-else>Hapus</span>
          </DangerButton>
        </template>
      </ConfirmationModal>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { Link, router } from '@inertiajs/vue3';
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

const showDeleteModal = ref(false);
const deleteProcessing = ref(false);

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const deleteSupplier = () => {
  deleteProcessing.value = true;
  
  router.delete(route('admin.suppliers.destroy', props.supplier.id), {
    preserveScroll: true,
    onSuccess: () => {
      showDeleteModal.value = false;
      deleteProcessing.value = false;
    },
    onError: () => {
      deleteProcessing.value = false;
    }
  });
};
</script>
