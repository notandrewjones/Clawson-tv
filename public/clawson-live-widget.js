/**
 * Clawson.TV Live Widget - Wix Custom Element
 * 
 * Usage in Wix:
 * 1. Add a Custom Element to your page
 * 2. Set the Server URL to: https://clawson-tv.vercel.app/clawson-live-widget.js
 * 3. Set the Tag Name to: clawson-live-widget
 */

const WIDGET_HTML = `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=Roboto:wght@400;500&display=swap');
    
    :host {
        display: block;
        width: 100%;
        height: 100%;
    }
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    .widget-container {
        --accent: #3D9BE9;
        --accent-hover: #2d8bd9;
        --bg-primary: #0a0a0a;
        --bg-secondary: #1a1a1a;
        --bg-tertiary: #252525;
        --bg-input: #2a2a2a;
        --text-primary: #ffffff;
        --text-secondary: #dddddd;
        --text-muted: #888888;
        --text-placeholder: #666666;
        --border-color: #333333;
        --shadow-color: rgba(0, 0, 0, 0.5);
        --system-bg: #1e3a5f;
        --system-text: #7dd3fc;
        
        font-family: 'Roboto', system-ui, sans-serif;
        font-weight: 500;
        background: var(--bg-primary);
        color: var(--text-primary);
        width: 100%;
        height: 100%;
        min-height: 400px;
        padding: 16px;
    }
    
    @media (prefers-color-scheme: light) {
        .widget-container {
            --bg-primary: #f5f5f5;
            --bg-secondary: #ffffff;
            --bg-tertiary: #e8e8e8;
            --bg-input: #ffffff;
            --text-primary: #1a1a1a;
            --text-secondary: #333333;
            --text-muted: #666666;
            --text-placeholder: #999999;
            --border-color: #dddddd;
            --shadow-color: rgba(0, 0, 0, 0.1);
            --system-bg: #e0f2fe;
            --system-text: #0369a1;
        }
    }
    
    h1, h2, h3, h4, h5, h6 {
        font-family: 'Poppins', sans-serif;
        font-weight: 800;
    }
    
    .main-content {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: 16px;
        align-items: start;
        height: 100%;
    }
    
    .video-column {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 0;
    }
    
    .video-container {
        aspect-ratio: 16/9;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 40px var(--shadow-color);
    }
    
    .video-container > div {
        width: 100%;
        height: 100%;
    }
    
    .content-banner {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        border: 1px solid var(--border-color);
    }
    
    .banner-text {
        flex: 1;
        min-width: 0;
    }
    
    .banner-text h2 {
        font-size: 1.1rem;
        margin-bottom: 4px;
        color: var(--accent);
    }
    
    .banner-text p {
        color: var(--text-muted);
        line-height: 1.4;
        font-size: 0.9rem;
    }
    
    .cta-button {
        display: inline-block;
        background: var(--accent);
        color: #fff;
        padding: 10px 20px;
        border-radius: 8px;
        text-decoration: none;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        font-size: 0.95rem;
        white-space: nowrap;
        flex-shrink: 0;
        transition: background 0.2s;
    }
    
    .cta-button:hover {
        background: var(--accent-hover);
    }
    
    .chat-column {
        display: flex;
        flex-direction: column;
        background: var(--bg-secondary);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border-color);
        height: 100%;
        min-height: 300px;
    }
    
    .chat-header {
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-color);
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        font-size: 1rem;
        color: var(--text-primary);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
    }
    
    .chat-header-left {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .online-count {
        font-family: 'Roboto', sans-serif;
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 500;
    }
    
    .chat-user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'Roboto', sans-serif;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--text-muted);
    }
    
    .chat-user-info .username {
        color: var(--accent);
        cursor: pointer;
    }
    
    .username-setup {
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        text-align: center;
    }
    
    .username-setup h3 {
        font-size: 1.25rem;
        margin-bottom: 8px;
        color: var(--text-primary);
    }
    
    .username-setup p {
        color: var(--text-muted);
        font-size: 0.95rem;
        margin-bottom: 20px;
    }
    
    .username-setup input {
        width: 100%;
        max-width: 250px;
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 12px 16px;
        color: var(--text-primary);
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        margin-bottom: 12px;
        text-align: center;
    }
    
    .username-setup input:focus {
        outline: none;
        border-color: var(--accent);
    }
    
    .username-setup button {
        background: var(--accent);
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 12px 32px;
        font-family: 'Poppins', sans-serif;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
    }
    
    .username-setup button:hover {
        background: var(--accent-hover);
    }
    
    .username-error {
        color: #ef4444;
        font-size: 0.85rem;
        margin-top: 8px;
    }
    
    .chat-messages {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-height: 100px;
    }
    
    .chat-message {
        padding: 8px 12px;
        background: var(--bg-tertiary);
        border-radius: 8px;
    }
    
    .chat-message.system {
        background: var(--system-bg);
        text-align: center;
        font-size: 0.85rem;
        color: var(--system-text);
    }
    
    .chat-message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
    }
    
    .chat-message-author {
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        color: var(--accent);
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .chat-message-author.moderator {
        color: #f59e0b;
    }
    
    .mod-badge {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #000;
        font-size: 0.65rem;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
        text-transform: uppercase;
    }
    
    .chat-message-time {
        font-size: 0.75rem;
        color: var(--text-muted);
    }
    
    .chat-message-content {
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.4;
        word-wrap: break-word;
    }
    
    .chat-input-area {
        padding: 16px;
        border-top: 1px solid var(--border-color);
        flex-shrink: 0;
    }
    
    .chat-input-wrapper {
        display: flex;
        gap: 12px;
    }
    
    .chat-input {
        flex: 1;
        min-width: 0;
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 12px 16px;
        color: var(--text-primary);
        font-family: 'Roboto', sans-serif;
        font-size: 0.95rem;
    }
    
    .chat-input:focus {
        outline: none;
        border-color: var(--accent);
    }
    
    .chat-input::placeholder {
        color: var(--text-placeholder);
    }
    
    .chat-send-btn {
        background: var(--accent);
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 12px 20px;
        font-family: 'Poppins', sans-serif;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        flex-shrink: 0;
    }
    
    .chat-send-btn:hover {
        background: var(--accent-hover);
    }
    
    .chat-send-btn:disabled {
        background: var(--bg-tertiary);
        color: var(--text-muted);
        cursor: not-allowed;
    }
    
    .chat-banned-notice {
        padding: 16px;
        text-align: center;
        border-top: 1px solid var(--border-color);
    }
    
    .banned-content {
        background: rgba(127, 29, 29, 0.3);
        border: 1px solid #7f1d1d;
        border-radius: 8px;
        padding: 12px 16px;
        color: #fca5a5;
        font-size: 0.9rem;
    }
    
    .banned-content strong {
        color: #ef4444;
    }
    
    .timeout-notice {
        background: #7f1d1d;
        color: #fca5a5;
        padding: 8px 16px;
        text-align: center;
        font-size: 0.85rem;
    }
    
    /* Responsive */
    @media (max-width: 900px) {
        .main-content {
            grid-template-columns: 1fr;
        }
        
        .chat-column {
            min-height: 350px;
        }
    }
    
    @media (max-width: 600px) {
        .widget-container {
            padding: 8px;
        }
        
        .main-content {
            gap: 8px;
        }
        
        .content-banner {
            padding: 12px;
            gap: 10px;
        }
        
        .banner-text h2 {
            font-size: 0.9rem;
        }
        
        .banner-text p {
            font-size: 0.8rem;
        }
        
        .cta-button {
            padding: 8px 14px;
            font-size: 0.8rem;
        }
    }
</style>

<div class="widget-container">
    <div class="main-content">
        <div class="video-column">
            <div class="video-container">
                <div id="resi-video-player" data-embed-id="__RESI_EMBED_ID__"></div>
            </div>
            
            <div class="content-banner">
                <div class="banner-text">
                    <h2 id="content-headline">Welcome!</h2>
                    <p id="content-body">Thanks for joining us. The service will begin shortly.</p>
                </div>
                <a id="content-button" href="https://clawson.churchcenter.com/people/forms/409083" class="cta-button" target="_blank">Connect Card</a>
            </div>
        </div>
        
        <div class="chat-column" id="chatColumn">
            <div class="chat-header">
                <div class="chat-header-left">
                    <span>💬 Live Chat</span>
                    <span class="online-count" id="onlineCount"></span>
                </div>
                <div class="chat-user-info" id="chatUserInfo" style="display: none;">
                    <span>Chatting as</span>
                    <span class="username" id="currentUsername"></span>
                </div>
            </div>
            
            <div class="username-setup" id="usernameSetup">
                <h3>Join the Chat</h3>
                <p>Choose a display name to start chatting</p>
                <input type="text" id="usernameInput" placeholder="Your name" maxlength="20" autocomplete="off">
                <button id="usernameSubmit">Join Chat</button>
                <div class="username-error" id="usernameError"></div>
            </div>
            
            <div class="timeout-notice" id="timeoutNotice" style="display: none;">
                You are timed out. <span id="timeoutRemaining"></span>
            </div>
            
            <div class="chat-messages" id="chatMessages" style="display: none;">
            </div>
            
            <div class="chat-input-area" id="chatInputArea" style="display: none;">
                <div class="chat-input-wrapper">
                    <input type="text" class="chat-input" id="chatInput" placeholder="Type a message..." maxlength="500">
                    <button class="chat-send-btn" id="chatSendBtn">Send</button>
                </div>
            </div>
            
            <div class="chat-banned-notice" id="chatBannedNotice" style="display: none;">
                <div class="banned-content">
                    <strong>⛔ You've been banned</strong><br>
                    You can no longer send messages in this chat.
                </div>
            </div>
        </div>
    </div>
</div>
`;

class ClawsonLiveWidget extends HTMLElement {
    constructor() {
        super();
        console.log('ClawsonLiveWidget: constructor called');
        this.username = null;
        this.supabaseClient = null;
    }

    connectedCallback() {
        console.log('ClawsonLiveWidget: connectedCallback called');
        
        // Create shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = WIDGET_HTML;
        
        console.log('ClawsonLiveWidget: shadow DOM created');
        
        // Initialize widget
        this.initializeWidget();
        
        // Load external scripts
        this.loadSupabase();
        this.loadResiPlayer();
    }
    
    loadSupabase() {
        console.log('ClawsonLiveWidget: loading Supabase');
        
        if (window.supabase) {
            console.log('ClawsonLiveWidget: Supabase already loaded');
            this.initializeSupabase();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
            console.log('ClawsonLiveWidget: Supabase script loaded');
            this.initializeSupabase();
        };
        script.onerror = (e) => {
            console.error('ClawsonLiveWidget: Failed to load Supabase', e);
        };
        document.head.appendChild(script);
    }
    
    loadResiPlayer() {
        console.log('ClawsonLiveWidget: loading Resi Player');
        
        // Check if already loaded
        if (document.querySelector('script[src*="resi.io/webplayer/loader"]')) {
            console.log('ClawsonLiveWidget: Resi already loaded');
            return;
        }
        
        const pageScript = document.createElement('script');
        pageScript.src = 'https://control.resi.io/webplayer/page.min.js';
        pageScript.defer = true;
        document.head.appendChild(pageScript);
        
        const loaderScript = document.createElement('script');
        loaderScript.src = 'https://control.resi.io/webplayer/loader.min.js';
        loaderScript.onload = () => {
            console.log('ClawsonLiveWidget: Resi loader script loaded');
        };
        document.head.appendChild(loaderScript);
    }
    
    initializeWidget() {
        console.log('ClawsonLiveWidget: initializeWidget called');
        
        const shadow = this.shadowRoot;
        
        // Get elements
        const usernameInput = shadow.getElementById('usernameInput');
        const usernameSubmit = shadow.getElementById('usernameSubmit');
        const usernameError = shadow.getElementById('usernameError');
        const usernameSetup = shadow.getElementById('usernameSetup');
        const chatMessages = shadow.getElementById('chatMessages');
        const chatInputArea = shadow.getElementById('chatInputArea');
        const chatInput = shadow.getElementById('chatInput');
        const chatSendBtn = shadow.getElementById('chatSendBtn');
        const chatUserInfo = shadow.getElementById('chatUserInfo');
        const currentUsername = shadow.getElementById('currentUsername');
        
        // Check for stored username
        try {
            const storedUsername = localStorage.getItem('clawson_chat_username');
            if (storedUsername) {
                console.log('ClawsonLiveWidget: found stored username', storedUsername);
                this.username = storedUsername;
                usernameSetup.style.display = 'none';
                chatMessages.style.display = 'flex';
                chatInputArea.style.display = 'block';
                chatUserInfo.style.display = 'flex';
                currentUsername.textContent = storedUsername;
            }
        } catch (e) {
            console.log('ClawsonLiveWidget: localStorage not available', e);
        }
        
        // Username submit
        usernameSubmit.addEventListener('click', () => {
            const name = usernameInput.value.trim();
            console.log('ClawsonLiveWidget: username submit clicked', name);
            
            if (name.length < 2) {
                usernameError.textContent = 'Name must be at least 2 characters';
                return;
            }
            if (name.length > 20) {
                usernameError.textContent = 'Name must be 20 characters or less';
                return;
            }
            
            this.username = name;
            try {
                localStorage.setItem('clawson_chat_username', name);
            } catch (e) {
                console.log('ClawsonLiveWidget: could not save to localStorage', e);
            }
            
            usernameSetup.style.display = 'none';
            chatMessages.style.display = 'flex';
            chatInputArea.style.display = 'block';
            chatUserInfo.style.display = 'flex';
            currentUsername.textContent = name;
            usernameError.textContent = '';
        });
        
        // Enter key on username input
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') usernameSubmit.click();
        });
        
        // Chat send
        chatSendBtn.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Change username
        currentUsername.addEventListener('click', () => {
            const newName = prompt('Enter new display name:', this.username);
            if (newName && newName.trim().length >= 2 && newName.trim().length <= 20) {
                this.username = newName.trim();
                try {
                    localStorage.setItem('clawson_chat_username', this.username);
                } catch (e) {}
                currentUsername.textContent = this.username;
            }
        });
        
        console.log('ClawsonLiveWidget: event listeners attached');
    }
    
    initializeSupabase() {
        console.log('ClawsonLiveWidget: initializeSupabase called');
        
        const SUPABASE_URL = 'https://tluancnqknilnxaiqeko.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsdWFuY25xa25pbG54YWlxZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTgwMzMsImV4cCI6MjA1Nzk5NDAzM30.JtE0LnlIheZkUNjyrdT4VXIjL15Ymd67d0fpKnBmjXw';
        
        try {
            this.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('ClawsonLiveWidget: Supabase client created');
            
            this.loadMessages();
            this.subscribeToMessages();
        } catch (e) {
            console.error('ClawsonLiveWidget: Error creating Supabase client', e);
        }
    }
    
    async loadMessages() {
        if (!this.supabaseClient) {
            console.log('ClawsonLiveWidget: No Supabase client for loadMessages');
            return;
        }
        
        console.log('ClawsonLiveWidget: loading messages');
        
        try {
            const { data, error } = await this.supabaseClient
                .from('chat_messages')
                .select('*')
                .order('created_at', { ascending: true })
                .limit(100);
            
            if (error) {
                console.error('ClawsonLiveWidget: Error loading messages', error);
                return;
            }
            
            console.log('ClawsonLiveWidget: loaded', data.length, 'messages');
            
            const chatMessages = this.shadowRoot.getElementById('chatMessages');
            
            // Add messages
            data.forEach(msg => this.addMessageToChat(msg));
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (err) {
            console.error('ClawsonLiveWidget: Error in loadMessages', err);
        }
    }
    
    subscribeToMessages() {
        if (!this.supabaseClient) return;
        
        console.log('ClawsonLiveWidget: subscribing to messages');
        
        this.supabaseClient
            .channel('chat_messages')
            .on('postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'chat_messages' },
                (payload) => {
                    console.log('ClawsonLiveWidget: new message received');
                    this.addMessageToChat(payload.new);
                    
                    // Auto-scroll
                    const chatMessages = this.shadowRoot.getElementById('chatMessages');
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            )
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'chat_messages' },
                (payload) => {
                    this.updateMessageInChat(payload.new);
                }
            )
            .subscribe();
    }
    
    addMessageToChat(msg) {
        const chatMessages = this.shadowRoot.getElementById('chatMessages');
        
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message' + (msg.is_system ? ' system' : '') + (msg.is_deleted ? ' deleted' : '');
        messageEl.dataset.messageId = msg.id;
        
        if (msg.is_system) {
            messageEl.textContent = msg.content;
        } else {
            const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const isMod = msg.is_moderator;
            
            messageEl.innerHTML = `
                <div class="chat-message-header">
                    <span class="chat-message-author${isMod ? ' moderator' : ''}">
                        ${this.escapeHtml(msg.username)}
                        ${isMod ? '<span class="mod-badge">MOD</span>' : ''}
                    </span>
                    <span class="chat-message-time">${time}</span>
                </div>
                <div class="chat-message-content">${msg.is_deleted ? '[Message deleted]' : this.escapeHtml(msg.content)}</div>
            `;
        }
        
        chatMessages.appendChild(messageEl);
    }
    
    updateMessageInChat(msg) {
        const messageEl = this.shadowRoot.querySelector(`[data-message-id="${msg.id}"]`);
        if (messageEl) {
            if (msg.is_deleted) {
                messageEl.classList.add('deleted');
                const content = messageEl.querySelector('.chat-message-content');
                if (content) content.textContent = '[Message deleted]';
            }
        }
    }
    
    async sendMessage() {
        if (!this.username || !this.supabaseClient) {
            console.log('ClawsonLiveWidget: Cannot send - no username or client');
            return;
        }
        
        const chatInput = this.shadowRoot.getElementById('chatInput');
        const content = chatInput.value.trim();
        
        if (!content) return;
        
        console.log('ClawsonLiveWidget: sending message');
        
        chatInput.value = '';
        chatInput.disabled = true;
        this.shadowRoot.getElementById('chatSendBtn').disabled = true;
        
        try {
            const { error } = await this.supabaseClient
                .from('chat_messages')
                .insert({
                    username: this.username,
                    content: content,
                    is_system: false,
                    is_deleted: false,
                    is_moderator: false
                });
            
            if (error) {
                console.error('ClawsonLiveWidget: Error sending message', error);
                chatInput.value = content;
            }
        } catch (err) {
            console.error('ClawsonLiveWidget: Error in sendMessage', err);
            chatInput.value = content;
        } finally {
            chatInput.disabled = false;
            this.shadowRoot.getElementById('chatSendBtn').disabled = false;
            chatInput.focus();
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Register the custom element
console.log('ClawsonLiveWidget: Registering custom element');
customElements.define('clawson-live-widget', ClawsonLiveWidget);
console.log('ClawsonLiveWidget: Custom element registered');