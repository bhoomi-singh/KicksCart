import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { mobileMenuOpen: false, searchOpen: false, theme: 'dark' },
  reducers: {
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
    closeMobileMenu: (state) => { state.mobileMenuOpen = false; },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
    setTheme: (state, action) => { state.theme = action.payload; },
  },
});

export const { toggleMobileMenu, closeMobileMenu, toggleSearch, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
