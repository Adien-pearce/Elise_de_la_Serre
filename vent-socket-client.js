const VentSocket = {
    socket: null,
    url: (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'localhost:8080' : window.location.host),
    connected: false,
    onMessageCallback: null,
    onStatusCallback: null,
    myId: null,
    memberCount: 0,
    reconnectAttempts: 0,
    maxReconnectAttempts: 3,

    init(onMessage, onStatus) {
        this.onMessageCallback = onMessage;
        this.onStatusCallback = onStatus;
        this.connect();
    },

    connect() {
        try {
            this.socket = new WebSocket(this.url);

            this.socket.onopen = () => {
                console.log('✅ Connected to Vent Server');
                this.connected = true;
                this.reconnectAttempts = 0;
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.type === 'init') {
                        this.myId = data.userId;
                        this.memberCount = data.memberCount;
                        if (this.onMessageCallback) this.onMessageCallback(data.history, true);
                    } else if (data.type === 'chat') {
                        if (this.onMessageCallback) this.onMessageCallback([data], false);
                    } else if (data.type === 'status') {
                        this.memberCount = data.memberCount;
                        if (this.onStatusCallback) this.onStatusCallback(this.memberCount);
                    } else if (data.type === 'error') {
                        if (typeof showNotification === 'function') {
                            showNotification(data.message, 'error');
                        }
                    }
                } catch (parseError) {
                    console.error('Error parsing WebSocket message:', parseError);
                }
            };

            this.socket.onclose = () => {
                console.log('❌ Disconnected from Vent Server');
                this.connected = false;
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    setTimeout(() => this.connect(), 5000);
                } else {
                    console.warn('⚠️ Vent Server unavailable. Running in local-only mode.');
                }
            };

            this.socket.onerror = (error) => {
                console.warn('⚠️ WebSocket connection error. Vent room may be unavailable.');
                this.connected = false;
            };
        } catch (e) {
            console.warn('⚠️ Socket connection failed. Vent room will not be available.');
            this.connected = false;
        }
    },

    sendMessage(text) {
        if (this.connected && this.socket) {
            try {
                this.socket.send(JSON.stringify({
                    type: 'chat',
                    text: text
                }));
                return true;
            } catch (e) {
                console.error('Error sending message:', e);
                return false;
            }
        }
        return false;
    }
};
