<template>
    <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-semibold text-gray-900">Tambah Produk Baru</h2>
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

            <!-- Error Messages -->
            <div v-if="$page.props.errors && Object.keys($page.props.errors).length > 0"
                class="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">
                            Terdapat {{ Object.keys($page.props.errors).length }} kesalahan pada pengisian form:
                        </h3>
                        <div class="mt-2 text-sm text-red-700">
                            <ul class="list-disc pl-5 space-y-1">
                                <li v-for="(error, field) in $page.props.errors" :key="field">
                                    {{ error }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
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
                                    <div
                                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span class="text-gray-500 sm:text-sm">Rp</span>
                                    </div>
                                    <input type="text" id="harga" v-model="form.harga" @input="formatHarga"
                                        class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
                                        :class="{ 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500': $page.props.errors?.harga }">
                                </div>
                                <p v-if="$page.props.errors?.harga" class="mt-2 text-sm text-red-600">{{
                                    $page.props.errors.harga }}</p>
                                <input type="hidden" v-model="form.harga_numeric">
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

                            <!-- Status -->
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
                                    Gambar Produk <span class="text-red-500">*</span>
                                </label>
                                <div class="mt-1 flex items-center">
                                    <span class="inline-block h-24 w-24 rounded-md overflow-hidden bg-gray-100"
                                        id="image-container">
                                        <img v-if="imagePreview" :src="imagePreview" alt="Preview"
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
                                            Pilih Gambar
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
                                <label for="deskripsi"
                                    class="block text-sm font-medium text-gray-700">Deskripsi</label>
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
                            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                        Batal
                        </Link>
                        <button type="submit"
                            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            :disabled="form.processing" :class="{ 'opacity-50': form.processing }">
                            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span v-if="form.processing">Menyimpan...</span>
                            <span v-else>Simpan Produk</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Link, useForm } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineOptions({
    layout: AdminLayout,
});

const props = defineProps({
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

const form = useForm({
    nama: '',
    kategori: '',
    supplier: '',
    harga: '',
    harga_numeric: 0,
    stok: 0,
    status: '1',
    gambar: null,
    deskripsi: ''
});

const formatHarga = (event) => {
    try {
        // Remove non-numeric characters
        let value = event.target.value.replace(/\D/g, '');

        // Store numeric value
        form.harga_numeric = value ? parseInt(value) : 0;

        // Format with thousand separators
        if (value) {
            value = parseInt(value).toLocaleString('id-ID');
        }

        // Update the input value
        form.harga = value;
    } catch (error) {
        console.error('Error formatting price:', error);
        form.harga = '';
        form.harga_numeric = 0;
    }
};

const onFileChange = (e) => {
    try {
        const file = e.target.files[0];
        console.log('File selected:', file?.name, 'Type:', file?.type, 'Size:', file?.size);

        if (file) {
            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran file terlalu besar. Maksimal 2MB.');
                e.target.value = '';
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert('Format file tidak didukung. Gunakan JPG, PNG, atau GIF.');
                e.target.value = '';
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log('File preview created successfully');
                imagePreview.value = e.target.result;
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                alert('Gagal membaca file. Silakan coba lagi.');
            };
            reader.readAsDataURL(file);

            // Set the file to the form
            console.log('Setting file to form.gambar:', file);
            form.gambar = file;
            console.log('form.gambar after setting:', form.gambar);
        } else {
            console.log('No file selected or file selection cancelled');
            imagePreview.value = null;
            form.gambar = null;
        }
    } catch (error) {
        console.error('Error handling file:', error);
        alert('Terjadi kesalahan saat memproses file.');
        e.target.value = '';
        imagePreview.value = null;
        form.gambar = null;
    }
};

const submit = () => {
    try {
        // Ensure numeric values are properly set before submission
        if (form.harga) {
            form.harga_numeric = parseInt(form.harga.replace(/\D/g, '') || '0');
        }

        // Validate required fields
        if (!form.nama.trim()) {
            alert('Nama produk harus diisi.');
            return;
        }

        if (!form.kategori) {
            alert('Kategori harus dipilih.');
            return;
        }

        if (!form.supplier) {
            alert('Supplier harus dipilih.');
            return;
        }

        if (!form.harga_numeric || form.harga_numeric <= 0) {
            alert('Harga harus diisi dengan benar.');
            return;
        }

        if (!form.gambar) {
            alert('Gambar produk harus dipilih.');
            return;
        }

        console.log('Form data before transform:', JSON.parse(JSON.stringify(form)));
        console.log('File object before transform:', form.gambar);
        
        // Create FormData manually to ensure proper file upload
        form.transform((data) => {
            console.log('Transform function - data received:', data);
            const formData = new FormData();
            
            // Append all form fields
            Object.keys(data).forEach(key => {
                if (key !== 'gambar' && data[key] !== null && data[key] !== undefined) {
                    console.log(`Appending field ${key}:`, data[key]);
                    formData.append(key, data[key]);
                }
            });
            
            // Append the file if it exists
            if (data.gambar && data.gambar instanceof File) {
                console.log('Appending file to formData:', data.gambar.name, data.gambar.size, data.gambar.type);
                formData.append('gambar', data.gambar, data.gambar.name);
                
                // Verify file is in formData
                console.log('formData entries:');
                for (let pair of formData.entries()) {
                    console.log(pair[0], pair[1]);
                }
            } else {
                console.warn('No valid file found in form data:', data.gambar);
            }
            
            return formData;
        })
        .post(route('admin.products.store'), {
            onStart: () => {
                console.log('Form submission started');
            },
            onProgress: (progress) => {
                console.log('Upload progress:', progress);
            },
            onSuccess: (response) => {
                console.log('Form submitted successfully', response);
                form.reset();
                imagePreview.value = null;
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                // Convert errors object to string if it's an object
                if (typeof errors === 'object' && errors !== null) {
                    const errorMessages = Object.values(errors).flat();
                    const errorMessage = errorMessages.join('\n');
                    console.error('Error details:', errorMessage);
                    alert(`Terjadi kesalahan: ${errorMessage}`);
                }
            },
            // Ensure proper headers are set for file upload
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'X-Inertia': 'true',
                'Content-Type': 'multipart/form-data'
            },
            // Force FormData handling
            forceFormData: true
        });
    } catch (error) {
        console.error('Error submitting form:', error);
        alert(`Terjadi kesalahan saat menyimpan data: ${error.message}`);
    }
};

// Debug data on mount
onMounted(() => {
    console.log('Props received:', {
        kategoris: props.kategoris,
        suppliers: props.suppliers
    });
});
</script>

<style scoped>
/* Add any custom styles here */
</style>