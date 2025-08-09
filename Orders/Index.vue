<script setup>
import { router, Link } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification'

defineOptions({
    layout: AdminLayout,
});

const props = defineProps({
    orders: {
        type: Object,
        required: true,
    },
    filters: {
        type: Object,
        default: () => ({}),
    },
    statusCounts: {
        type: Object,
        default: () => ({}),
    },
    statusOptions: {
        type: Object,
        default: () => ({}),
    },
});

// Convert status values to match the Order model
const statuses = {
    'Menunggu Review': 'Menunggu Review',
    'Dibayar': 'Dibayar',
    'Diproses': 'Diproses',
    'Dikirim': 'Dikirim',
    'Selesai': 'Selesai',
    'Dibatalkan': 'Dibatalkan',
};

const getStatusBadgeClass = (status) => {
    // Normalize the status to title case for consistent matching
    const normalizedStatus = status.toLowerCase() === 'menunggu review' ? 'Menunggu Review' : 
                           status.toLowerCase() === 'dibayar' ? 'Dibayar' :
                           status.toLowerCase() === 'diproses' ? 'Diproses' :
                           status.toLowerCase() === 'dikirim' ? 'Dikirim' :
                           status.toLowerCase() === 'selesai' ? 'Selesai' :
                           status.toLowerCase() === 'dibatalkan' ? 'Dibatalkan' : status;
    
    const classes = {
        'Menunggu Review': 'bg-yellow-100 text-yellow-800',
        'Dibayar': 'bg-blue-100 text-blue-800',
        'Diproses': 'bg-blue-100 text-blue-800',
        'Dikirim': 'bg-indigo-100 text-indigo-800',
        'Selesai': 'bg-green-100 text-green-800',
        'Dibatalkan': 'bg-red-100 text-red-800',
    };
    return classes[normalizedStatus] || 'bg-gray-100 text-gray-800';
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

// Helper function to get status in consistent format - returns exact values expected by backend
const getNormalizedStatus = (status) => {
    if (!status) return status;
    
    // First check exact matches
    const exactMatch = [
        'Menunggu Review', 'Dibayar', 'Diproses', 
        'Dikirim', 'Selesai', 'Dibatalkan'
    ].find(s => s === status);
    
    if (exactMatch) return exactMatch;
    
    // Then check case-insensitive matches
    const lowerStatus = status.toLowerCase().trim();
    
    if (lowerStatus === 'menunggu review' || lowerStatus.includes('menunggu')) return 'Menunggu Review';
    if (lowerStatus === 'dibayar') return 'Dibayar';
    if (lowerStatus === 'diproses') return 'Diproses';
    if (lowerStatus === 'dikirim') return 'Dikirim';
    if (lowerStatus === 'selesai') return 'Selesai';
    if (lowerStatus === 'dibatalkan') return 'Dibatalkan';
    
    console.warn('Unknown status value:', status);
    return status; // Return as-is if no match found (will be validated by backend)
};

// Status update configuration - using title case
const statusFlow = {
    'Menunggu Review': {
        next: 'Dibayar',
        previous: null,
        nextLabel: 'Bayar',
        nextClass: 'bg-green-600 hover:bg-green-700 text-white',
        // Add lowercase alias
        _aliases: ['menunggu review']
    },
    'Dibayar': {
        next: 'Diproses',
        previous: 'Menunggu Review',
        nextLabel: 'Proses',
        previousLabel: 'Kembali ke Review',
        nextClass: 'bg-blue-600 hover:bg-blue-700 text-white',
        previousClass: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        _aliases: ['dibayar']
    },
    'Diproses': {
        next: 'Dikirim',
        previous: 'Dibayar',
        nextLabel: 'Kirim',
        previousLabel: 'Kembali ke Dibayar',
        nextClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        previousClass: 'bg-blue-600 hover:bg-blue-700 text-white',
        _aliases: ['diproses']
    },
    'Dikirim': {
        next: 'Selesai',
        previous: 'Diproses',
        nextLabel: 'Selesai',
        previousLabel: 'Kembali ke Diproses',
        nextClass: 'bg-green-600 hover:bg-green-700 text-white',
        previousClass: 'bg-blue-600 hover:bg-blue-700 text-white',
        _aliases: ['dikirim']
    },
    'Selesai': {
        next: null,
        previous: 'Dikirim',
        previousLabel: 'Kembali ke Dikirim',
        previousClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        _aliases: ['selesai']
    },
    'Dibatalkan': {
        next: null,
        previous: null,
        _aliases: ['dibatalkan']
    }
};

// Create a lookup map for case-insensitive status matching
const statusLookup = {
    'menunggu review': 'Menunggu Review',
    'dibayar': 'Dibayar',
    'diproses': 'Diproses',
    'dikirim': 'Dikirim',
    'selesai': 'Selesai',
    'dibatalkan': 'Dibatalkan'
};

// Add aliases from statusFlow to statusLookup
Object.entries(statusFlow).forEach(([status, data]) => {
    if (data._aliases) {
        data._aliases.forEach(alias => {
            statusLookup[alias.toLowerCase()] = status;
        });
    }
});

// Helper function to get status flow with case insensitivity
const getStatusFlow = (status) => {
    if (!status) return null;
    
    // First try direct match
    if (statusFlow[status]) {
        return statusFlow[status];
    }
    
    // Try case-insensitive match
    const lowerStatus = status.toLowerCase();
    if (statusLookup[lowerStatus]) {
        return statusFlow[statusLookup[lowerStatus]] || null;
    }
    
    // Check aliases
    for (const [key, value] of Object.entries(statusFlow)) {
        if (value._aliases && value._aliases.includes(lowerStatus)) {
            return value;
        }
    }
    
    return null;
};

// Methods - moved inside script setup
const updateFilters = (key, value) => {
    router.get(route('admin.orders.index'), 
        { ...route().params, [key]: value || undefined, page: 1 },
        { preserveState: true, preserveScroll: true, replace: true }
    );
};

const viewOrder = (orderId) => {
    console.log('Attempting to view order:', orderId);
    try {
        const url = `/orders/${orderId}`;
        console.log('Navigating to:', url);
        router.visit(url, {
            onSuccess: (page) => {
                console.log('Navigation successful', page);
            },
            onError: (errors) => {
                console.error('Navigation error:', errors);
                alert('Gagal memuat detail pesanan. Silakan coba lagi.');
            },
            onFinish: (visit) => {
                console.log('Navigation finished', visit);
            }
        });
    } catch (error) {
        console.error('Error in viewOrder:', error);
    }
};






// Inisialisasi toast
const toast = useToast()

// Debug: Log available routes

const updateOrderStatus = async (orderId, newStatus) => {
    // Map the status to match the backend constants
    const statusMap = {
        'Menunggu Review': 'Menunggu Review',
        'Dibayar': 'Dibayar',
        'Diproses': 'Diproses',
        'Dikirim': 'Dikirim',
        'Selesai': 'Selesai',
        'Dibatalkan': 'Dibatalkan'
    };
    
    const normalizedStatus = statusMap[newStatus] || newStatus;
    
    if (!Object.values(statusMap).includes(normalizedStatus)) {
        console.error('Invalid status:', newStatus);
        toast.error('Status tidak valid');
        return;
    }

    // Buat custom modal confirmation
    const confirmed = await new Promise((resolve) => {
        // Buat modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        // Buat modal content
        const modal = document.createElement('div');
        modal.className = 'bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl';
        
        modal.innerHTML = `
            <div class="flex flex-col space-y-4">
                <h3 class="text-lg font-semibold text-gray-900">Konfirmasi Perubahan Status</h3>
                <p class="text-sm text-gray-600">
                    Anda yakin ingin mengubah status pesanan menjadi "<strong>${normalizedStatus}</strong>"?
                </p>
                <div class="flex space-x-3 justify-end">
                    <button id="modal-cancel" class="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 text-gray-700 rounded transition-colors">
                        Batal
                    </button>
                    <button id="modal-confirm" class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                        Ya, Ubah
                    </button>
                </div>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Event handlers
        const confirmBtn = modal.querySelector('#modal-confirm');
        const cancelBtn = modal.querySelector('#modal-cancel');
        
        const cleanup = () => {
            document.body.removeChild(overlay);
        };
        
        confirmBtn.onclick = () => {
            cleanup();
            resolve(true);
        };
        
        cancelBtn.onclick = () => {
            cleanup();
            resolve(false);
        };
        
        // Close on overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                cleanup();
                resolve(false);
            }
        };
        
        // Close on ESC key
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                cleanup();
                resolve(false);
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    });

    if (!confirmed) {
        return;
    }

    // Tampilkan loading toast
    const loadingToast = toast.info('Memperbarui status pesanan...', {
        timeout: false,
        closeOnClick: false,
        draggable: false
    });

    try {
        console.log('Updating order status:', {
            orderId,
            normalizedStatus,
            route: route('admin.orders.update-status', orderId)
        });
        
        // Use POST method to update status with form data
        const formData = new FormData();
        formData.append('status', normalizedStatus);
        formData.append('_method', 'PUT');
        
        const response = await axios.post(route('admin.orders.update-status', orderId), formData, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            }
        });
        
        // Tutup loading toast
        toast.dismiss(loadingToast);
        
        // Tampilkan success toast
        toast.success(
            `Status pesanan berhasil diubah menjadi "${normalizedStatus}"`,
            {
                timeout: 5000,
                position: 'top-right'
            }
        );
        
        // Refresh the page to show updated status
        window.location.reload();
        
    } catch (error) {
        console.error('Update status error:', error);
        
        // Tutup loading toast jika masih ada
        toast.dismiss(loadingToast);
        
        let errorMessage = 'Gagal mengupdate status pesanan';
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response:', error.response.data);
            errorMessage = error.response.data.message || error.response.data.error || errorMessage;
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            errorMessage = 'Tidak ada respon dari server. Silakan coba lagi.';
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
            errorMessage = error.message || errorMessage;
        }
        
        // Tampilkan error toast
        toast.error(
            `Terjadi kesalahan: ${errorMessage}`,
            {
                timeout: 8000,
                position: 'top-right'
            }
        );
    }
};

// Watch for changes in filters
const search = ref(props.filters.search || '');
const status = ref(props.filters.status || 'all');

watch(search, (value) => {
    updateFilters('search', value);
}, { debounce: 300 }); // Added debounce to prevent too many requests

watch(status, (value) => {
    updateFilters('status', value);
});






</script>

<template>
    <Head title="Daftar Pesanan" />

    <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-semibold text-gray-900">Daftar Pesanan</h1>
                <div class="flex items-center space-x-4">
                    <div class="text-sm text-gray-500">
                        Total: {{ statusCounts.all }} pesanan
                    </div>
                </div>
            </div>

            <!-- Status Tabs -->
            <div class="border-b border-gray-200 mb-6">
                <nav class="-mb-px flex space-x-8 overflow-x-auto">
                    <button
                        v-for="(label, value) in statusOptions"
                        :key="value"
                        @click="status = value"
                        :class="[
                            status === value
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                        ]"
                    >
                        {{ label }}
                        <span 
                            v-if="statusCounts[value]"
                            :class="[
                                status === value ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                                'ml-2 py-0.5 px-2 rounded-full text-xs font-medium'
                            ]"
                        >
                            {{ statusCounts[value] }}
                        </span>
                    </button>
                </nav>
            </div>

            <!-- Search and Filter -->
            <div class="bg-white shadow-sm rounded-lg p-4 mb-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div class="flex-1">
                        <label for="search" class="sr-only">Cari</label>
                        <div class="relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                v-model="search"
                                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                placeholder="Cari pesanan..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Orders Table -->
            <div class="bg-white shadow-sm rounded-lg overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No. Pesanan
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pelanggan
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Open
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="order in orders.data" :key="order.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                                    #{{ order.id }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div v-if="order.user" class="space-y-1">
                                        <div class="text-sm font-medium text-gray-900">{{ order.user.name || 'Tamu' }}</div>
                                        <div class="text-sm text-gray-500">{{ order.user.telepon || '-' }}</div>
                                    </div>
                                    <div v-else class="text-sm text-gray-500">Data pelanggan tidak tersedia</div>
                                </td>

                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ formatCurrency(order.total_harga) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusBadgeClass(order.status)]">
                                        {{ order.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>{{ new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</div>
                                    <div class="text-xs text-gray-400">
                                        {{ new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-y-2">
                                    <div class="flex flex-col space-y-2">
                                        <button
                                            v-if="getStatusFlow(order.status)?.previous"
                                            @click="updateOrderStatus(order.id, getStatusFlow(order.status).previous)"
                                            :class="[
                                                'inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm',
                                                'text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
                                                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                                                'mt-1'
                                            ]"
                                        >
                                            <svg class="h-3.5 w-3.5 mr-1.5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                            {{ getStatusFlow(order.status).previousLabel || `Kembali ke ${getStatusFlow(order.status).previous}` }}
                                        </button>
                                        <button
                                            v-if="getStatusFlow(order.status)?.next"
                                            @click="updateOrderStatus(order.id, getStatusFlow(order.status).next)"
                                            :class="[
                                                'inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm',
                                                getStatusFlow(order.status).next === 'Dibatalkan' 
                                                    ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                                                    : 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                                                'focus:outline-none focus:ring-2 focus:ring-offset-2'
                                            ]"
                                        >
                                            <svg v-if="getStatusFlow(order.status).next === 'Dibatalkan'" 
                                                class="h-3.5 w-3.5 mr-1.5" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <svg v-else 
                                                class="h-3.5 w-3.5 mr-1.5" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {{ getStatusFlow(order.status).next === 'Dibatalkan' ? 'Batalkan' : `Tandai ${getStatusFlow(order.status).next}` }}
                                        </button>
                                        <button 
                                            type="button"
                                            class="inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            @click="updateOrderStatus(order.id, 'Dibatalkan')"
                                        >
                                            Dibatalkan
                                        </button>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-y-2">
                                    <Link 
                                        :href="route('admin.orders.show', order.id)" 
                                        class="inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <svg class="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                            <tr v-if="orders.data.length === 0">
                                <td colspan="7" class="px-6 py-12 text-center">
                                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                    <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada pesanan</h3>
                                    <p class="mt-1 text-sm text-gray-500">
                                        {{ filters.search ? 'Tidak ada pesanan yang cocok dengan pencarian Anda.' : 'Belum ada pesanan yang tercatat.' }}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Pagination -->
                <div v-if="orders.last_page > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div class="flex-1 flex justify-between sm:hidden">
                        <Link 
                            v-if="orders.prev_page_url"
                            :href="orders.prev_page_url" 
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Sebelumnya
                        </Link>
                        <span v-else class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-50 cursor-not-allowed">
                            Sebelumnya
                        </span>
                        <Link 
                            v-if="orders.next_page_url"
                            :href="orders.next_page_url"
                            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Selanjutnya
                        </Link>
                        <span v-else class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-50 cursor-not-allowed">
                            Selanjutnya
                        </span>
                    </div>
                    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p class="text-sm text-gray-700">
                                Menampilkan
                                <span class="font-medium">{{ orders.from }}</span>
                                sampai
                                <span class="font-medium">{{ orders.to }}</span>
                                dari
                                <span class="font-medium">{{ orders.total }}</span> hasil
                            </p>
                        </div>
                        <div>
                            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <template v-for="(link, index) in orders.links" :key="index">
                                    <Link 
                                        v-if="link.url"
                                        :href="link.url"
                                        :class="[
                                            link.active 
                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                                            'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                                        ]"
                                        v-html="link.label"
                                    ></Link>
                                    <span 
                                        v-else
                                        :class="[
                                            'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                            'bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed'
                                        ]"
                                        v-html="link.label"
                                    ></span>
                                </template>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>