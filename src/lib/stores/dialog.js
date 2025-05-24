import { writable } from 'svelte/store';

export const dialogVisible = writable(false);

export function showDialog() {
    dialogVisible.set(true);
}

export function hideDialog() {
    dialogVisible.set(false);
} 