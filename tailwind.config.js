export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#2563EB',
                page: '#F5F7FA',
                card: '#FFFFFF',
                title: '#0F172A',
                muted: '#64748B',
            },
            boxShadow: {
                card: '0 8px 20px rgba(15, 23, 42, 0.08)',
            },
        },
    },
    plugins: [],
}

