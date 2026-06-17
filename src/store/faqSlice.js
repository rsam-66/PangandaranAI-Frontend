import { createSlice } from '@reduxjs/toolkit';
import { faqCategories } from '@/data/faqData';

const faqSlice = createSlice({
    name: 'faq',
    initialState: {
        categories: faqCategories,
        selectedCategory: null,
    },
    reducers: {
        selectCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        clearCategory: (state) => {
            state.selectedCategory = null;
        },
    },
});

export const { selectCategory, clearCategory } = faqSlice.actions;
export default faqSlice.reducer;
