/**
 * Sample destination data for Pangandaran tourism
 * Used by mock API and destination cards
 */

const DEFAULT_IMAGE = '/images/default-image.webp';

export const destinations = [
    {
        id: 'pantai-pangandaran',
        title: 'Pantai Pangandaran',
        description:
            'Pantai Pangandaran merupakan sebuah objek wisata andalan Kabupaten Pangandaran (sebelumnya dari Kabupaten Ciamis) yang terletak di sebelah tenggara Jawa Barat, tepatnya di Desa Pangandaran dan Pananjung, sekitar 223 km dari selatan Bandung, Kabupaten Pangandaran, Provinsi Jawa Barat.',
        image: '/images/pantai-pangandaran.webp',
        rating: 4.5,
        reviews: 100,
        price: 20000,
        category: 'beaches',
        address: 'Desa Pangandaran dan Pananjung',
        location: { lat: -7.6932, lng: 108.6553 },
        photos: 418,
    },
    {
        id: 'pantai-karapyak',
        title: 'Pantai Karapyak',
        description:
            'Pantai Karapyak terkenal dengan ombaknya yang cocok untuk surfing. Pantai ini memiliki pemandangan yang indah dengan tebing-tebing karang yang menakjubkan.',
        image: DEFAULT_IMAGE,
        rating: 4.8,
        reviews: 100,
        category: 'beaches',
        price: 15000,
        address: 'Ds. Masawah, Kec. Cimerak',
        location: { lat: -7.7125, lng: 108.6108 },
        photos: 25,
    },
    {
        id: 'pantai-karangnini',
        title: 'Pantai Karangnini',
        description:
            'Pantai Karangnini adalah pantai tersembunyi dengan pemandangan tebing hijau yang menakjubkan. Suasana tenang dan asri menjadikannya tempat yang sempurna untuk menikmati keindahan alam Pangandaran.',
        image: '/images/pantai-karangnini.webp',
        rating: 4.3,
        reviews: 100,
        category: 'beaches',
        price: 10000,
        address: 'Ds. Karangnini, Kec. Cimerak',
        location: { lat: -7.7150, lng: 108.5900 },
        photos: 15,
    },
    {
        id: 'pantai-lembah-putri',
        title: 'Pantai Lembah Putri',
        description:
            'Pantai Lembah Putri terkenal dengan keindahan tebing karangnya dan pemandangan laut yang menakjubkan. Cocok untuk menikmati sunset dan fotografi.',
        image: DEFAULT_IMAGE,
        rating: 4.4,
        reviews: 80,
        category: 'beaches',
        price: 10000,
        address: 'Ds. Cibenda, Kec. Parigi',
        location: { lat: -7.7100, lng: 108.5750 },
        photos: 20,
    },
    {
        id: 'pantai-karang-tirta',
        title: 'Pantai Karang Tirta',
        description:
            'Pantai Karang Tirta menawarkan kolam renang alami yang terbentuk dari karang. Tempat yang unik untuk berenang sambil menikmati pemandangan laut.',
        image: DEFAULT_IMAGE,
        rating: 4.2,
        reviews: 60,
        category: 'beaches',
        price: 15000,
        address: 'Kec. Pangandaran',
        location: { lat: -7.7050, lng: 108.6200 },
        photos: 12,
    },
    {
        id: 'pantai-batu-hiu',
        title: 'Pantai Batu Hiu',
        description:
            'Pantai Batu Hiu dikenal dengan batu karang besar yang menyerupai sirip hiu. Tempat yang sempurna untuk menikmati sunset dan pemandangan laut lepas.',
        image: DEFAULT_IMAGE,
        rating: 4.2,
        reviews: 2000,
        category: 'beaches',
        price: 10000,
        address: 'Ds. Ciliang, Kec. Parigi',
        location: { lat: -7.7186, lng: 108.5861 },
        photos: 15,
    },
    {
        id: 'pantai-batu-karas',
        title: 'Pantai Batu Karas',
        description:
            'Pantai Batu Karas adalah surga bagi peselancar pemula. Ombak yang tenang dan konsisten menjadikannya spot surfing terbaik di Jawa Barat.',
        image: DEFAULT_IMAGE,
        rating: 4.6,
        reviews: 8000,
        category: 'beaches',
        price: 15000,
        address: 'Ds. Batukaras, Kec. Cijulang',
        location: { lat: -7.7378, lng: 108.5083 },
        photos: 35,
    },
    {
        id: 'pantai-madasari',
        title: 'Pantai Madasari',
        description:
            'Pantai Madasari menawarkan pesona camping di tepi pantai dengan pemandangan laut yang luas. Salah satu pantai favorit untuk berkemah di Pangandaran.',
        image: DEFAULT_IMAGE,
        rating: 4.3,
        reviews: 150,
        category: 'beaches',
        price: 15000,
        address: 'Ds. Masawah, Kec. Cimerak',
        location: { lat: -7.7200, lng: 108.5650 },
        photos: 18,
    },
    {
        id: 'kampung-turis',
        title: 'Kampung Turis Pangandaran',
        description:
            'Area wisata terpadu dengan berbagai penginapan, restoran, dan aktivitas wisata. Cocok untuk basis penjelajahan Pangandaran.',
        image: '/images/kp-turis-pangandaran.webp',
        rating: 4.1,
        reviews: 100,
        category: 'hotels',
        price: 0,
        address: 'Jl. Pangandaran, Wonoharjo',
        location: { lat: -7.6945, lng: 108.6520 },
        photos: 20,
    },
    {
        id: 'morgan-seafood',
        title: 'Morgan Seafood',
        description:
            'Restoran seafood populer di Pangandaran yang menyajikan hidangan laut segar dengan harga terjangkau. Favorit wisatawan lokal dan mancanegara.',
        image: '/images/morgan-seafood.webp',
        rating: 4.4,
        reviews: 100,
        category: 'food',
        price: 0,
        address: 'Jl. Pangandaran No.10, Wonoharjo',
        location: { lat: -7.6938, lng: 108.6548 },
        photos: 10,
    },
];
