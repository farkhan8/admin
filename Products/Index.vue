<template>
    <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-semibold text-gray-900">Daftar Produk</h2>
                <Link :href="route('admin.products.create')"
                    class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Tambah Produk
                </Link>
            </div>

            <!-- Toast Notification Container -->
            <div id="toast-container" class="fixed top-4 right-4 z-50 space-y-4">
                <!-- Toast notifications will be added here dynamically -->
            </div>

            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Gambar
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Produk
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kategori
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Harga
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stok
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    <span class="sr-only">Aksi</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="product in products?.data || []" :key="product.id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div v-if="product.gambar" class="h-10 w-10 rounded-md overflow-hidden">
                                        <img 
                                        :src="getImageUrl(product.gambar)" 
                                        :alt="product.nama" 
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
                                    <div class="text-sm font-medium text-gray-900">{{ product.nama }}</div>
                                    <div class="text-xs text-green-500">{{ product.supplier_name || 'Tanpa Supplier' }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {{ product.category_name || '-' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span
                                        class="px-2 inline-flex text-xs leading-5 font-semibool bold rounded-full bg-green-100 text-green-800">
                                        Rp {{ formatPrice(product.harga) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stok > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`">
                                        {{ product.stok }} pcs
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stok > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`">
                                        {{ product.stok > 0 ? 'Tersedia' : 'Habis' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex space-x-2">
                                        <Link :href="route('admin.products.edit', product.id)"
                                            class="text-indigo-600 hover:text-indigo-900" :title="'Edit'">
                                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                            </path>
                                        </svg>
                                        </Link>
                                        <button @click="confirmDelete(product)" class="text-red-600 hover:text-red-900"
                                            :title="'Hapus'">
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
                            <tr v-if="!products?.data || products.data.length === 0">
                                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
                                    <div class="text-gray-500">
                                        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                        </svg>
                                        <p class="text-sm font-medium">Belum ada produk yang tersedia.</p>
                                        <p class="text-xs text-gray-400 mt-1">Klik tombol "Tambah Produk" untuk menambah
                                            produk baru.</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <Pagination v-if="products?.links" :links="products.links"
                    class="px-4 py-3 bg-gray-50 border-t border-gray-200" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { Link, router, usePage } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import Pagination from '@/Components/Pagination.vue';
import { ref, onMounted } from 'vue';

defineOptions({
    layout: AdminLayout,
});

const props = defineProps({
    products: {
        type: Object,
        default: () => ({ data: [], links: [] })
    }
});

// Show flash messages as toasts on component mount
onMounted(() => {
    const { flash } = usePage().props;
    if (flash?.success) {
        showToast('success', flash.success);
    }
    if (flash?.error) {
        showToast('error', flash.error);
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

const formatPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('id-ID').format(price);
};

const showToast = (type, message) => {
    const toast = document.createElement('div');
    toast.className = `px-6 py-3 rounded-md shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } animate-fade-in-up mb-2`;
    toast.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${type === 'success' ? 
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' :
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
                }
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    const container = document.getElementById('toast-container');
    if (!container) {
        console.error('Toast container not found');
        return;
    }
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 5000);
};

const showConfirmationDialog = (message, onConfirm, onCancel = null) => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'bg-white rounded-lg shadow-xl max-w-md w-full mx-4';
    dialog.innerHTML = `
        <div class="p-6">
            <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                </div>
                <h3 class="mt-3 text-lg font-medium text-gray-900">Konfirmasi Hapus</h3>
                <div class="mt-2">
                    <p class="text-sm text-gray-500">${message}</p>
                </div>
                <div class="mt-5 flex justify-center space-x-4">
                    <button type="button" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="cancelBtn">
                        Batal
                    </button>
                    <button type="button" class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" id="confirmBtn">
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const confirmBtn = dialog.querySelector('#confirmBtn');
    const cancelBtn = dialog.querySelector('#cancelBtn');
    
    const cleanup = () => {
        if (overlay.parentNode) {
            document.body.removeChild(overlay);
        }
    };
    
    const handleConfirm = () => {
        cleanup();
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    };
    
    const handleCancel = () => {
        cleanup();
        if (typeof onCancel === 'function') {
            onCancel();
        }
    };
    
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
    
    // Close when clicking outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            handleCancel();
        }
    });
    
    // Add to DOM
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // Focus the cancel button by default
    cancelBtn.focus();
};

const confirmDelete = (product) => {
    showConfirmationDialog(
        `Apakah Anda yakin ingin menghapus produk <strong>${product.nama}</strong>?`,
        () => {
            // Show loading indicator
            const loadingEl = document.createElement('div');
            loadingEl.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            loadingEl.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p class="mt-4 text-gray-700">Menghapus produk...</p>
                </div>
            `;
            document.body.appendChild(loadingEl);
            
            // Use POST with _method=DELETE for better compatibility
            router.post(route('admin.products.destroy', product.id), {
                _method: 'DELETE',
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    if (loadingEl && loadingEl.parentNode) {
                        loadingEl.remove();
                    }
                    showToast('success', 'Produk berhasil dihapus');
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    if (loadingEl && loadingEl.parentNode) {
                        loadingEl.remove();
                    }
                    showToast('error', 'Terjadi kesalahan saat menghapus produk');
                }
            });
        }
    );
}
</script>

<style scoped>
/* Add any custom styles here */
</style>

<style>
/* Animation for toast */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out forwards;
}
</style>