import { writable } from 'svelte/store';

// Store para controlar qual livro tem o menu aberto (null significa nenhum)
export const activeMenu = writable(null); 