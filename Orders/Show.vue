<script setup>
import { Link } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { onMounted } from 'vue';

defineOptions({
    layout: AdminLayout,
});

const props = defineProps({
    order: {
        type: Object,
        required: true,
        default: () => ({
            keranjang: []
        })
    }
});

// Log when component is mounted
onMounted(() => {
    console.log('Order details loaded:', props.order);
    console.log('Keranjang items:', props.order.keranjang);
    if (props.order.keranjang) {
        console.log('Keranjang count:', props.order.keranjang.length);
        props.order.keranjang.forEach((item, index) => {
            console.log(`Item ${index + 1}:`, item);
        });
    }
});

const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: id });
    } catch (e) {
        return dateString;
    }
};

const getProductImage = (item) => {
  // First try to use the product image from the keranjang item
  if (item.gambar_produk) {
    return item.gambar_produk;
  }
  
  // Then try to use the related product's image
  if (item.produk?.gambar) {
    return item.produk.gambar;
  }
  
  // Fallback to placeholder
  return 'https://via.placeholder.com/40';
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
</script>

<template>
    <div class="px-4 py-8 sm:px-6 lg:px-8">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto px-4">
                    <h1 class="text-xl font-semibold text-gray-900">Detail Pesanan #{{ order.id }}</h1>
                    <p class="mt-2 text-sm text-gray-700">
                        Status:
                        <span :class="{
                            'bg-yellow-100 text-yellow-800': order.status === 'menunggu review' || order.status === 'diproses',
                            'bg-green-100 text-green-800': order.status === 'dibayar' || order.status === 'selesai',
                            'bg-blue-100 text-blue-800': order.status === 'dikirim',
                            'bg-red-100 text-red-800': order.status === 'dibatalkan'
                        }" class="px-3 py-1 text-sm font-medium rounded-full">
                            {{ order.status }}
                        </span>
                    </p>
                </div>
                <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link :href="route('admin.orders.index')"
                        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Kembali ke Daftar Pesanan
                    </Link>
                </div>
            </div>

            <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Informasi Pelanggan</h3>
                </div>
                <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl class="sm:divide-y sm:divide-gray-200">
                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Nama</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ order.user.name }}</dd>
                        </div>
                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Email</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ order.user.email }}</dd>
                        </div>
                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Telepon</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <a v-if="order.telepon" :href="'https://wa.me/62' + order.telepon" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 hover:underline">
                                    {{ order.telepon }}
                                </a>
                                <span v-else>-</span>
                            </dd>
                        </div>
                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Alamat</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span v-if="order.alamat">{{ order.alamat }}</span>
                                <span v-else>-</span>
                            </dd>
                        </div>
                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Tanggal Pemesanan</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ formatDate(order.created_at) }}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Detail Pembayaran</h3>
                </div>
                <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl class="sm:divide-y sm:divide-gray-200">
                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Metode Pembayaran</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ order.metode_pembayaran || 'Transfer Bank' }}
                            </dd>
                        </div>
                        <div v-if="order.dompet" class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Rekening Tujuan</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-x-2">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {{ order.dompet.bank }}
                                </span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {{ order.dompet.nomor }}
                                </span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {{ order.dompet.atas_nama }}
                                </span>
                            </dd>
                        </div>
                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Total Pembayaran</dt>
                            <dd class="mt-1 text-lg font-semibold text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ formatCurrency(order.total_harga) }}
                            </dd>
                        </div>
                        <div v-if="order.bukti" class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Bukti Pembayaran</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div class="mt-2">
                                    <img :src="'/storage/' + order.bukti" :alt="'Bukti Pembayaran ' + order.id" class="max-w-xs rounded-lg shadow-sm border border-gray-200">
                                    <div class="mt-2">
                                        <a :href="'/storage/' + order.bukti" target="_blank" class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                                            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                            </svg>
                                            Lihat ukuran penuh
                                        </a>
                                    </div>
                                </div>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div class="mt-8 py-6">
                <div class="sm:flex sm:items-center">
                    <div class="sm:flex-auto">
                        <h3 class="text-lg font-medium text-gray-900">Produk Dipesan</h3>
                    </div>
                </div>
                <div class="mt-4 flex flex-col">
                    <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table class="min-w-full divide-y divide-gray-300">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col"
                                                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Produk</th>
                                            <th scope="col"
                                                class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                Harga Satuan</th>
                                            <th scope="col"
                                                class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                Kuantitas</th>
                                            <th scope="col"
                                                class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 bg-white">
                                        <tr v-if="!order.keranjang || order.keranjang.length === 0">
                                            <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                                                Tidak ada produk dalam pesanan ini.
                                            </td>
                                        </tr>
                                        <tr v-else v-for="item in order.keranjang" :key="item.id">
                                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <div class="flex items-center">
                                                    <div class="h-10 w-10 flex-shrink-0">
                                                        <img 
                                                            class="h-10 w-10 rounded-md object-cover" 
                                                            :src="getProductImage(item)" 
                                                            :alt="item.nama_produk || (item.produk && item.produk.nama) || 'Produk'" 
                                                            @error="(e) => e.target.src = 'https://via.placeholder.com/40'"
                                                        />
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="font-medium text-gray-900">
                                                            {{ item.nama_produk || (item.produk && item.produk.nama) || 'Produk tidak ditemukan' }}
                                                        </div>
                                                        <div class="text-gray-500">SKU: {{ item.produk_id || '-' }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
                                                {{ formatCurrency(item.harga_produk || (item.produk && item.produk.harga) || 0) }}
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
                                                {{ item.quantity || 1 }}
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                                                {{ formatCurrency(item.total_harga || (item.harga_produk * item.quantity) || 0) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th scope="row" colspan="3"
                                                class="hidden pt-4 pl-6 pr-3 pb-4 text-right text-2xl font-normal text-gray-500 sm:table-cell">
                                                Total
                                            </th>
                                            <td class="pt-4 pl-3 pr-6 pb-4 text-right text-2xl font-semibold text-gray-900">
                                                {{ formatCurrency(order.total_harga) }}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                                <div class="mt-4 p-4 bg-gray-50 border-l-4 border-blue-400 rounded-r">
                                    <div class="flex">
                                        <div class="flex-shrink-0">
                                            <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div class="ml-3">
                                            <h3 class="text-sm font-medium text-blue-800">Catatan Pesanan</h3>
                                            <div class="mt-1 text-sm text-blue-700">
                                                <p>{{ order.catatan || 'Tidak ada catatan' }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

