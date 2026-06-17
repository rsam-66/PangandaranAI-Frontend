/**
 * FAQ categories and template prompts for Pangandaran tourism
 * These appear as suggestion cards in the chatbot welcome state
 */

export const faqCategories = [
    {
        id: 'beaches',
        icon: '🏖️',
        label: 'Pantai & Wisata',
        questions: [
            'Berikan daftar pantai-pantai yang ada di pangandaran',
            'Apa pantai terbaik untuk berenang di Pangandaran?',
            'Dimana lokasi Green Canyon Pangandaran?',
            'Pantai mana yang cocok untuk surfing?',
        ],
    },
    {
        id: 'hotels',
        icon: '🏨',
        label: 'Penginapan',
        questions: [
            'Berikan daftar penginapan pinggir pantai pangandaran',
            'Rekomendasi hotel murah di dekat Pantai Pangandaran',
            'Homestay terbaik di Pangandaran',
            'Hotel bintang 3 di Pangandaran dengan kolam renang',
        ],
    },
    {
        id: 'food',
        icon: '🍜',
        label: 'Kuliner',
        questions: [
            'Makanan hits yang paling diminati di pantai pangandaran',
            'Restoran seafood terbaik di Pangandaran',
            'Jajanan khas Pangandaran yang wajib dicoba',
            'Tempat makan dekat Pantai Pangandaran',
        ],
    },
    {
        id: 'transport',
        icon: '🚗',
        label: 'Transportasi',
        questions: [
            'Bagaimana cara ke Pangandaran dari Jakarta?',
            'Bagaimana cara ke Pangandaran dari Bandung?',
            'Apakah ada transportasi umum ke Pangandaran?',
            'Berapa lama perjalanan dari Jakarta ke Pangandaran?',
        ],
    },
    {
        id: 'services',
        icon: '💱',
        label: 'Layanan',
        questions: [
            'Dimana lokasi money changer di pangandaran?',
            'ATM terdekat di sekitar Pantai Pangandaran',
            'Rumah sakit atau klinik di Pangandaran',
            'Dimana bisa sewa motor di Pangandaran?',
        ],
    },
];

/**
 * Template prompts shown on the chatbot welcome screen
 * These are the first-level suggestions users see
 */
export const templatePrompts = [
    {
        id: 'popular',
        text: 'Beritahu perjalanan yang sering dikunjungi orang-orang',
        icon: '🗺️',
    },
    {
        id: 'hotels',
        text: 'Berikan daftar penginapan pinggir pantai pangandaran',
        icon: '🏨',
    },
    {
        id: 'food',
        text: 'Makanan hits yang paling diminati di pantai pangandaran',
        icon: '🍜',
    },
    {
        id: 'money',
        text: 'Dimana lokasi money changer di pangandaran?',
        icon: '💱',
    },
    {
        id: 'beaches',
        text: 'Berikan daftar pantai-pantai yang ada di pangandaran',
        icon: '🏖️',
    },
];
