const FirebaseUtils = {
    isInitialized() {
        return !!(window.db && window.userId && window.firebaseImports);
    },

    isReady() {
        return this.isInitialized();
    },

    getFirebaseImports() {
        if (!window.firebaseImports) {
            console.warn('Firebase imports not available');
            return null;
        }
        return window.firebaseImports;
    },

    getDb() {
        if (!window.db) {
            console.warn('Firestore database not initialized');
            return null;
        }
        return window.db;
    },

    getUserId() {
        if (!window.userId) {
            console.warn('User ID not available');
            return null;
        }
        return window.userId;
    },

    async executeWithFallback(firebaseOperation, fallbackOperation) {
        try {
            if (!this.isInitialized()) {
                console.warn('Firebase not initialized, using fallback');
                return await fallbackOperation();
            }
            return await firebaseOperation();
        } catch (error) {
            console.error('Firebase operation failed, using fallback:', error);
            try {
                return await fallbackOperation();
            } catch (fallbackError) {
                console.error('Fallback operation also failed:', fallbackError);
                throw fallbackError;
            }
        }
    },

    logStatus() {
        console.log('Firebase Status:', {
            initialized: this.isInitialized(),
            hasDb: !!window.db,
            hasUserId: !!window.userId,
            hasImports: !!window.firebaseImports,
            mode: this.isInitialized() ? 'ONLINE' : 'LOCAL_ONLY'
        });
    }
};

window.FirebaseUtils = FirebaseUtils;
