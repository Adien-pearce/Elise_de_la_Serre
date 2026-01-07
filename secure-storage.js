const SecureStorage = {
    keyName: 'melo_encryption_key',
    algorithmName: 'AES-GCM',
    
    async getEncryptionKey() {
        let key = await this.getStoredKey();
        if (!key) {
            key = await window.crypto.subtle.generateKey(
                { name: 'AES-GCM', length: 256 },
                true,
                ['encrypt', 'decrypt']
            );
            await this.storeKey(key);
        }
        return key;
    },

    async storeKey(key) {
        try {
            const exported = await window.crypto.subtle.exportKey('jwk', key);
            sessionStorage.setItem(this.keyName, JSON.stringify(exported));
        } catch (error) {
            console.error('Failed to store encryption key:', error);
        }
    },

    async getStoredKey() {
        try {
            const stored = sessionStorage.getItem(this.keyName);
            if (!stored) return null;
            
            const imported = await window.crypto.subtle.importKey(
                'jwk',
                JSON.parse(stored),
                { name: 'AES-GCM' },
                true,
                ['encrypt', 'decrypt']
            );
            return imported;
        } catch (error) {
            console.error('Failed to retrieve encryption key:', error);
            return null;
        }
    },

    async encrypt(data) {
        try {
            const key = await this.getEncryptionKey();
            const encoded = new TextEncoder().encode(JSON.stringify(data));
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            
            const encrypted = await window.crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encoded
            );
            
            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(encrypted), iv.length);
            
            return btoa(String.fromCharCode.apply(null, combined));
        } catch (error) {
            console.error('Encryption failed:', error);
            return null;
        }
    },

    async decrypt(encryptedData) {
        try {
            if (!encryptedData) return null;
            
            const key = await this.getEncryptionKey();
            const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
            
            const iv = combined.slice(0, 12);
            const data = combined.slice(12);
            
            const decrypted = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );
            
            return JSON.parse(new TextDecoder().decode(decrypted));
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    },

    async setSecure(key, value) {
        try {
            const encrypted = await this.encrypt(value);
            if (encrypted) {
                sessionStorage.setItem(`secure_${key}`, encrypted);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Failed to store secure value for ${key}:`, error);
            return false;
        }
    },

    async getSecure(key) {
        try {
            const encrypted = sessionStorage.getItem(`secure_${key}`);
            if (!encrypted) return null;
            return await this.decrypt(encrypted);
        } catch (error) {
            console.error(`Failed to retrieve secure value for ${key}:`, error);
            return null;
        }
    },

    removeSecure(key) {
        sessionStorage.removeItem(`secure_${key}`);
    }
};

window.SecureStorage = SecureStorage;
