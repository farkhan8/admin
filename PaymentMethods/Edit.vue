<script setup>
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineOptions({
    layout: AdminLayout,
});

const props = defineProps({
    dompet: {
        type: Object,
        required: true
    }
});

const form = useForm({
    bank: props.dompet.bank,
    nomor: props.dompet.nomor,
    atas_nama: props.dompet.atas_nama,
    saldo: parseFloat(props.dompet.saldo.replace(/\./g, '')),
    deskripsi: props.dompet.deskripsi || ''
});

const submit = () => {
    // Use router.post with method spoofing like in user delete
    router.post(route('admin.dompet.update', props.dompet.id), {
        _method: 'PUT',
        bank: form.bank,
        nomor: form.nomor,
        atas_nama: form.atas_nama,
        saldo: form.saldo,
        deskripsi: form.deskripsi
    }, {
        onSuccess: () => {
            // You can add a success notification here
        },
        onError: (errors) => {
            console.log('Update errors:', errors);
        }
    });
};
</script>

<template>
    <Head :title="`Edit Dompet - ${dompet.bank}`" />

    <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-semibold text-gray-900">Edit Dompet</h2>
                <Link :href="route('admin.dompet.index')" 
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Kembali ke Daftar Dompet
                </Link>
            </div>

            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    <form @submit.prevent="submit">
                        <div class="space-y-6">
                            <!-- Bank Name -->
                            <div>
                                <label for="bank" class="block text-sm font-medium text-gray-700">
                                    Nama Bank <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="bank" v-model="form.bank" required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    :class="{ 'border-red-300': form.errors.bank }" />
                                <p v-if="form.errors.bank" class="mt-1 text-sm text-red-600">
                                    {{ form.errors.bank }}
                                </p>
                            </div>

                            <!-- Account Number -->
                            <div>
                                <label for="nomor" class="block text-sm font-medium text-gray-700">
                                    Nomor Rekening <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="nomor" v-model="form.nomor" required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    :class="{ 'border-red-300': form.errors.nomor }" />
                                <p v-if="form.errors.nomor" class="mt-1 text-sm text-red-600">
                                    {{ form.errors.nomor }}
                                </p>
                            </div>

                            <!-- Account Name -->
                            <div>
                                <label for="atas_nama" class="block text-sm font-medium text-gray-700">
                                    Atas Nama <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="atas_nama" v-model="form.atas_nama" required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    :class="{ 'border-red-300': form.errors.atas_nama }" />
                                <p v-if="form.errors.atas_nama" class="mt-1 text-sm text-red-600">
                                    {{ form.errors.atas_nama }}
                                </p>
                            </div>

                            <!-- Saldo -->
                            <div>
                                <label for="saldo" class="block text-sm font-medium text-gray-700">
                                    Saldo <span class="text-red-500">*</span>
                                </label>
                                <input type="number" id="saldo" v-model.number="form.saldo" required min="0" step="1"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    :class="{ 'border-red-300': form.errors.saldo }" />
                                <p v-if="form.errors.saldo" class="mt-1 text-sm text-red-600">
                                    {{ form.errors.saldo }}
                                </p>
                            </div>

                            <!-- Deskripsi -->
                            <div>
                                <label for="deskripsi" class="block text-sm font-medium text-gray-700">
                                    Deskripsi
                                </label>
                                <textarea id="deskripsi" v-model="form.deskripsi" rows="3"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    :class="{ 'border-red-300': form.errors.deskripsi }"></textarea>
                                <p v-if="form.errors.deskripsi" class="mt-1 text-sm text-red-600">
                                    {{ form.errors.deskripsi }}
                                </p>
                            </div>

                            <!-- Submit Button -->
                            <div class="flex justify-end">
                                <button type="button" @click="$inertia.visit(route('admin.dompet.index'))"
                                    class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3">
                                    Batal
                                </button>
                                <button type="submit"
                                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    :disabled="form.processing">
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
