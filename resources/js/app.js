import '../css/app.css';
import './bootstrap';

import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Coba cari komponen di path langsung, misalnya 'Admin/Dashboard.vue'
        const pages = import.meta.glob('./Pages/**/*.vue');
        let path = `./Pages/${name}.vue`;

        if (!pages[path]) {
            // Jika tidak ditemukan, coba cari file 'Index.vue' di dalam subfolder
            path = `./Pages/${name}/Index.vue`;
        }
        
        // Handle cases where the name might be 'Admin/Dashboard/Index.vue'
        if (!pages[path] && name.endsWith('/Index')) {
            path = `./Pages/${name}.vue`;
        }

        if (!pages[path]) {
            // Jika masih tidak ditemukan, lemparkan error yang lebih informatif
            throw new Error(`Page not found: ./${path}`);
        }
        
        return pages[path]();
    },
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
