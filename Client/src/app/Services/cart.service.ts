import { Injectable, signal, computed, effect } from '@angular/core';
import { CertificationScheme } from '../Models/certification';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItemsSignal = signal<CertificationScheme[]>(this.loadCart());

    cartItems = computed(() => this.cartItemsSignal());

    cartCount = computed(() => this.cartItemsSignal().length);

    cartTotal = computed(() => {
        return this.cartItemsSignal().reduce((acc, item) => acc + item.amount, 0);
    });

    constructor() {
        // Persist cart to local storage whenever it changes
        effect(() => {
            localStorage.setItem('cert_cart', JSON.stringify(this.cartItemsSignal()));
        });
    }

    private loadCart(): CertificationScheme[] {
        const saved = localStorage.getItem('cert_cart');
        return saved ? JSON.parse(saved) : [];
    }

    addToCart(scheme: CertificationScheme) {
        const current = this.cartItemsSignal();
        const exists = current.find(item => item.id === scheme.id);

        if (!exists) {
            this.cartItemsSignal.set([...current, scheme]);
            return true;
        }
        return false;
    }

    removeFromCart(schemeId: number) {
        this.cartItemsSignal.set(
            this.cartItemsSignal().filter(item => item.id !== schemeId)
        );
    }

    clearCart() {
        this.cartItemsSignal.set([]);
    }

    isInCart(schemeId: number): boolean {
        return this.cartItemsSignal().some(item => item.id === schemeId);
    }
}
