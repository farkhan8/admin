<template>
    <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-semibold text-gray-900">
                    Edit Produk: {{ product?.nama || 'Loading...' }}
                </h2>
                <Link :href="route('admin.products.index')"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                </svg>
                Kembali ke Daftar Produk
                </Link>
            </div>

            <!-- Loading State -->
            <div v-if="!product" class="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                <p class="text-gray-500">Memuat data produk...</p>
            </div>

            <!-- Form -->
            <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
                <form @submit.prevent="submit">
                    <div class="px-4 py-5 sm:p-6">
                        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <!-- Nama Produk -->
                            <div class="sm:col-span-4">
                                <label for="nama" class="block text-sm font-medium text-gray-700">Nama Produk <span
                                        class="text-red-500">*</span></label>
                                <div class="mt-1">
                                    <input type="text" id="nama" v-model="form.nama"
                                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        :class="{ 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500': $page.props.errors?.nama }">
                                </div>
                                <p v-if="$page.props.errors?.nama" class="mt-2 text-sm text-red-600">{{
                                    $page.props.errors.nama }}</p>
                            </div>

                            <!-- Kategori -->
                            <div class="sm:col-span-4">
                                <label for="kategori" class="block text-sm font-medium text-gray-700">Kategori <span
                                        class="text-red-500">*</span></label>
                                <div class="mt-1">
                                    <select id="kategori" v-model="form.kategori"
                                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        :class="{ 'border-red-300 text-red-900': $page.props.errors?.kategori }">
                                        <option value="">Pilih Kategori</option>
                                        <option v-for="kategori in kategoris || []" :key="kategori.id"
                                            :value="kategori.id">
                                            {{ kategori.text }}
                                        </option>
                                    </select>
                                </div>
                                <p v-if="$page.props.errors?.kategori" class="mt-2 text-sm text-red-600">{{
                                    $page.props.errors.kategori }}</p>
                            </div>

                            <!-- Supplier -->
                            <div class="sm:col-span-4">
                                <label for="supplier" class="block text-sm font-medium text-gray-700">Supplier <span
                                        class="text-red-500">*</span></label>
                                <div class="mt-1">
                                    <select id="supplier" v-model="form.supplier"
                                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        :class="{ 'border-red-300 text-red-900': $page.props.errors?.supplier }">
                                        <option value="">Pilih Supplier</option>
                                        <option v-for="supplier in suppliers || []" :key="supplier.id"
                                            :value="supplier.id">
                                            {{ supplier.text }}
                                        </option>
                                    </select>
                                </div>
                                <p v-if="$page.props.errors?.supplier" class="mt-2 text-sm text-red-600">{{
                                    $page.props.errors.supplier }}</p>
                            </div>

                            <!-- Harga dan Stok -->
                            <div class="sm:col-span-2">
                                <label for="harga" class="block text-sm font-medium text-gray-700">Harga (Rp) <span
                                        class="text-red-500">*</span></label>
                                <div class="mt-1 relative rounded-md shadow-sm">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span class="text-gray-500 sm:text-sm">Rp</span>
                                    </div>
                                    <input type="text" id="harga" v-model="form.harga" @input="formatHarga"
                                        class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
                                        :class="{ 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500': $page.props.errors?.harga }">
                                </div>
                                <p v-if="$page.props.errors?.harga" class="mt-2 text-sm text-red-600">{{
                                    $page.props.errors.harga }}</p>
                            </div>

                            <div class="sm:col-span-2">
                                <label for="stok" class="block text-sm font-medium text-gray-700">Stok <span
                                        class="text-red-500">*</span></label>
                                <div class="mt-1">
                                    <input type="number" id="stok" v-model.number="form.stok" min="0"
                                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        :class="{ 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500': $page.props.errors?.stok }">
                                </div>
                                <p v-if="$page.props.errors?.stok" class="mt-2 text-sm text-red-600">{{
                                    $page.props.errors.stok }}</p>
                            </div>

                            <div class="sm:col-span-2">
                                <label for="status" class="block text-sm font-medium text-gray-700">Status <span
                                        class="text-red-500">*</span></label>
                                <div class="mt-1">
                                    <select id="status" v-model="form.status"
                                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        :class="{ 'border-red-300 text-red-900': $page.props.errors?.status }">
                                        <option value="1">Tersedia</option>
                                        <option value="0">Habis</option>
                                    </select>
                                </div>
                                <p v-if="$page.props.errors?.status" class="mt-2 text-sm text-red-600">{{
                                    $page.props.errors.status }}</p>
                            </div>

                            <!-- Gambar Produk -->
                            <div class="sm:col-span-6">
                                <label class="block text-sm font-medium text-gray-700">
                                    Gambar Produk
                                    <span v-if="!product?.gambar" class="text-red-500">*</span>
                                </label>
                                <div class="mt-1 flex items-center">
                                    <span class="inline-block h-24 w-24 rounded-md overflow-hidden bg-gray-100">
                                        <img v-if="!imagePreview && product?.gambar" :src="`/storage/${product.gambar}`"
                                            :alt="product.nama" class="h-full w-full object-cover">
                                        <img v-else-if="imagePreview" :src="imagePreview" alt="Preview"
                                            class="h-full w-full object-cover">
                                        <svg v-else class="h-full w-full text-gray-300" fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <path
                                                d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </span>
                                    <div class="ml-4">
                                        <label for="gambar"
                                            class="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            {{ imagePreview || product?.gambar ? 'Ganti Gambar' : 'Pilih Gambar' }}
                                        </label>
                                        <input id="gambar" type="file" class="sr-only" accept="image/*"
                                            @change="onFileChange">
                                    </div>
                                </div>
                                <p class="mt-2 text-sm text-gray-500">Format: JPG, PNG, GIF (Maks. 2MB)</p>
                                <p v-if="$page.props.errors?.gambar" class="mt-2 text-sm text-red-600">{{
                                    $page.props.errors.gambar }}</p>

                            </div>

                            <!-- Deskripsi -->
                            <div class="sm:col-span-6">
                                <label for="deskripsi" class="block text-sm font-medium text-gray-700">Deskripsi</label>
                                <div class="mt-1">
                                    <textarea id="deskripsi" v-model="form.deskripsi" rows="3"
                                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                        :class="{ 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500': $page.props.errors?.deskripsi }"></textarea>
                                </div>
                                <p class="mt-2 text-sm text-gray-500">Deskripsi singkat tentang produk Anda.</p>
                                <p v-if="$page.props.errors?.deskripsi" class="mt-2 text-sm text-red-600">{{
                                    $page.props.errors.deskripsi }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <Link :href="route('admin.products.index')"
                            class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Batal
                        </Link>
                        <button type="submit"
                            class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            :disabled="form.processing" :class="{ 'opacity-50': form.processing }">
                            <span v-if="form.processing">Menyimpan...</span>
                            <span v-else>Perbarui Produk</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Link, useForm } from '@inertiajs/vue3';
import { ref, onMounted, watch, nextTick } from 'vue';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineOptions({
    layout: AdminLayout,
});

const props = defineProps({
    product: {
        type: Object,
        default: () => null
    },
    kategoris: {
        type: Array,
        default: () => []
    },
    suppliers: {
        type: Array,
        default: () => []
    }
});

const imagePreview = ref(null);

// Show toast notification
const showToast = (type, message) => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
};

// Show validation errors from Laravel
const showValidationErrors = (errors) => {
    if (!errors || Object.keys(errors).length === 0) return;
    
    let errorMessages = [];
    for (const [field, messages] of Object.entries(errors)) {
        if (Array.isArray(messages)) {
            errorMessages = [...errorMessages, ...messages];
        } else {
            errorMessages.push(messages);
        }
    }
    
    if (errorMessages.length > 0) {
        showToast('error', errorMessages.join('<br>'));
    }
};

// Helper function to convert status to select value
const statusToSelectValue = (status) => {
    if (status === true || status === 'true' || status === 1 || status === '1') return '1';
    return '0';
};

// Initialize form with product data or defaults
const form = useForm({
    _method: 'PUT',
    nama: props.product?.nama || '',
    kategori: props.product?.category_id || props.product?.kategori || '',
    supplier: props.product?.supplier_id || props.product?.supplier || '',
    harga: props.product?.harga || '',
    stok: props.product?.stok || 0,
    status: statusToSelectValue(props.product?.status), // Convert boolean to string
    deskripsi: props.product?.deskripsi || '',
    gambar: null,
    hapus_gambar: false
});

// Format price on mount
onMounted(() => {
    try {
        // Format price if it's a number
        if (form.harga && typeof form.harga === 'number') {
            form.harga = new Intl.NumberFormat('id-ID').format(form.harga);
        }
        
        // Show success message if redirected with flash data
        if (props.flash?.success) {
            showToast('success', props.flash.success);
        }
        
        // Show error message if redirected with error
        if (props.flash?.error) {
            showToast('error', props.flash.error);
        }
        
        // Show validation errors if any
        if (props.errors && Object.keys(props.errors).length > 0) {
            showValidationErrors(props.errors);
        }
        
        // Force update the status after a small delay
        if (props.product?.status !== undefined) {
            const statusValue = statusToSelectValue(props.product.status);
            form.status = statusValue;
            
            // Also update the select element directly
            nextTick(() => {
                const statusSelect = document.getElementById('status');
                if (statusSelect) {
                    statusSelect.value = statusValue;
                }
            });
        }
    } catch (error) {
        console.error('Error in onMounted:', error);
    }
});

const formatHarga = (event) => {
    try {
        // Remove non-numeric characters
        let value = event.target.value.replace(/\D/g, '');

        // Format with thousand separators
        if (value) {
            form.harga = parseInt(value).toLocaleString('id-ID');
        } else {
            form.harga = '';
        }
    } catch (error) {
        console.error('Error formatting price:', error);
        form.harga = '';
    }
};

const onFileChange = (e) => {
    try {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            showToast('error', 'Format file tidak didukung. Harap unggah file JPG, PNG, atau GIF.');
            e.target.value = '';
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            showToast('error', 'Ukuran file terlalu besar. Maksimal 2MB.');
            e.target.value = '';
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.onerror = () => {
            console.error('Error reading file');
            showToast('error', 'Gagal membaca file. Silakan coba lagi.');
        };
        reader.readAsDataURL(file);

        // Set the file to the form
        form.gambar = file;

        // Uncheck hapus_gambar if a new image is selected
        form.hapus_gambar = false;
    } catch (error) {
        console.error('Error handling file:', error);
        showToast('error', 'Terjadi kesalahan saat memproses file.');
        e.target.value = '';
        imagePreview.value = null;
        form.gambar = null;
    }
};

const submit = async () => {
    try {
        // Show loading indicator
        const loadingEl = document.createElement('div');
        loadingEl.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loadingEl.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p class="mt-4 text-gray-700">Menyimpan...</p>
            </div>
        `;
        document.body.appendChild(loadingEl);

        // Convert formatted price back to number before submitting
        if (form.harga) {
            const numericPrice = form.harga.toString().replace(/\D/g, '');
            form.harga = numericPrice;
        }

        // Basic validation
        if (!form.nama.trim()) {
            if (loadingEl && loadingEl.parentNode) {
                loadingEl.remove();
            }
            showToast('error', 'Nama produk harus diisi.');
            return;
        }

        if (!form.kategori) {
            if (loadingEl && loadingEl.parentNode) {
                loadingEl.remove();
            }
            showToast('error', 'Kategori harus dipilih.');
            return;
        }

        if (!form.supplier) {
            if (loadingEl && loadingEl.parentNode) {
                loadingEl.remove();
            }
            showToast('error', 'Supplier harus dipilih.');
            return;
        }

        if (!form.harga || parseInt(form.harga) <= 0) {
            if (loadingEl && loadingEl.parentNode) {
                loadingEl.remove();
            }
            showToast('error', 'Harga harus diisi dengan benar.');
            return;
        }

        // Get the CSRF token from the meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        if (!csrfToken) {
            console.error('CSRF token not found');
            if (loadingEl && loadingEl.parentNode) {
                loadingEl.remove();
            }
            showToast('error', 'Sesi tidak valid. Silakan muat ulang halaman dan coba lagi.');
            return;
        }

        // Create form data
        const formData = new FormData();
        formData.append('_method', 'PUT');
        
        // Append all form fields except gambar and hapus_gambar
        Object.keys(form).forEach(key => {
            if (key !== 'gambar' && key !== 'hapus_gambar' && form[key] !== null && form[key] !== undefined) {
                formData.append(key, form[key]);
            }
        });
        
        // Only append gambar if a new file was selected
        if (form.gambar && form.gambar instanceof File) {
            formData.append('gambar', form.gambar, form.gambar.name);
        }
        
        // Handle hapus_gambar checkbox
        if (form.hapus_gambar) {
            formData.append('hapus_gambar', '1');
        }

        // Log form data for debugging
        console.log('Submitting form data:');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ', pair[1]);
        }

        // Submit the form using axios directly
        axios.post(route('admin.products.update', props.product?.id), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            },
            baseURL: window.location.origin,
        })
        .then(response => {
            if (loadingEl && loadingEl.parentNode) {
                loadingEl.remove();
            }
            showToast('success', 'Produk berhasil diperbarui!');
            // Reset file input and preview
            const fileInput = document.getElementById('gambar');
            if (fileInput) {
                fileInput.value = '';
            }
            imagePreview.value = null;
            setTimeout(() => {
                window.location.href = route('admin.products.index');
            }, 1000);
        })
        .catch(error => {
            console.error('Error updating product:', error);
            if (loadingEl && loadingEl.parentNode) {
                loadingEl.remove();
            }
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
                
                if (error.response.status === 422) {
                    // Handle validation errors
                    const errors = error.response.data.errors;
                    showValidationErrors(errors);
                } else if (error.response.status === 404) {
                    showToast('error', 'Produk tidak ditemukan.');
                } else if (error.response.status === 403) {
                    showToast('error', 'Anda tidak memiliki izin untuk memperbarui produk ini.');
                } else if (error.response.data.message) {
                    showToast('error', error.response.data.message);
                } else {
                    showToast('error', 'Terjadi kesalahan saat memperbarui produk. Silakan coba lagi.');
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                showToast('error', 'Tidak ada respons dari server. Periksa koneksi internet Anda dan coba lagi.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', error.message);
                showToast('error', 'Terjadi kesalahan saat mengirim permintaan. Silakan coba lagi.');
            }
        });
    } catch (error) {
        console.error('Error submitting form:', error);
        showToast('error', 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    }
};


</script>

<style scoped>
/* Add any custom styles here */
</style>