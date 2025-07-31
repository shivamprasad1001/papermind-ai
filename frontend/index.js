class PDFChatApp {
    constructor() {
        this.pdfText = '';
        this.fileName = '';
        this.conversationHistory = [];
        this.isProcessing = false;
        // Default avatars (can be updated in the future)
        this.avatars = {
            user: '🧑',
            assistant: '🤖'
        };
        this.initializeElements();
        this.bindEvents();

        // for notification =>
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.className = 'pdf-notification-container';
        document.body.appendChild(this.notificationContainer);
        this.notificationQueue = [];
        this.isShowing = false;


        this.currentFile = null;
        this.initSidebarArrow();
        
    


}

initializeElements() {
    this.uploadArea = document.getElementById('uploadArea');
    this.fileInput = document.getElementById('fileInput');
    this.fileStatus = document.getElementById('fileStatus');
    this.welcomeScreen = document.getElementById('welcomeScreen');
    this.messagesContainer = document.getElementById('messagesContainer');
    this.chatContainer = document.getElementById('chatContainer');
    this.messageInput = document.getElementById('messageInput');
    this.sendButton = document.getElementById('sendButton');

}

bindEvents() {
    this.uploadArea.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files[0]));
    this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
    this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
    this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    });

    this.messageInput.addEventListener('input', this.autoResizeTextarea.bind(this));
}

handleDragOver(e) {
    e.preventDefault();
    this.uploadArea.classList.add('dragover');
}

handleDragLeave(e) {
    e.preventDefault();
    this.uploadArea.classList.remove('dragover');
}

handleDrop(e) {
    e.preventDefault();
    this.uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        this.handleFileSelect(files[0]);
    }
}
initSidebarArrow() {
        // We'll use event delegation since we can't directly target :before
        document.querySelector('.sidebar').addEventListener('click', (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const arrowClickArea = 30; // pixels from right edge considered arrow click
            
            // Check if click was in the arrow area (right side)
            if (e.clientX > rect.right - arrowClickArea) {
                if (!this.currentFile) {
                    // Trigger file input click if no PDF is loaded
                    document.getElementById('pdf-upload-input').click();
                } else {
                    // If PDF already loaded, just reopen sidebar
                    this.showpdf(this.currentFile);
                }
            }
        });
        this.updateArrow();
    }
    updateArrow() {
        const arrow = window.getComputedStyle(
            document.querySelector('.sidebar'), ':before'
        ).content;
        
        // Toggle between → and ←
        const newArrow = this.isSidebarOpen ? '"←"' : '"→"';
        document.querySelector('.sidebar').style.setProperty('--arrow', newArrow);
    }

showpdf(file) {
    this.currentFile = file;

    if (file && file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        const iframe = document.getElementById("pdf-preview");
        iframe.src = fileURL;

        const container = document.getElementById("pdf-preview-container");
        container.style.display = "block";
        const sidebar = document.querySelector('.sidebar');
            sidebar.style.display = "block";

        // Trigger the animation by changing width after a small delay
        setTimeout(() => {
            container.style.width = "50%";
            container.style.transition = "width 0.5s ease-in-out"; // Add transition
        }, 10);

    } else {
        alert("Please select a valid PDF file.");
    }
        this.updateArrow();


}

    async handleFileSelect(file) {
        this.currentFile = file;
    if (!file || file.type !== 'application/pdf') {
        this.showNotification('Please select a valid PDF file.', 'error');
        return;
    }

    this.fileName = file.name;
    this.showProcessingState();

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch("http://127.0.0.1:8000/upload_pdf", {

            method: "POST",
            body: formData
        });

        const result = await response.json();
        console.log(result);

        if (response.ok && result.status === "success") {
            this.showPDFLoaded();
            this.enableChat();
            this.showChatInterface();
            this.showNotification("PDF uploaded and ingested successfully!", 'success');
        } else {
            this.showNotification("Error: " + (result.error || "Unknown error."), 'error');
            this.resetUploadState();
        }
    } catch (error) {
        console.error('PDF processing error:', error);
        this.showNotification('Failed to process PDF.', 'error');
        this.resetUploadState();
    }
}



showProcessingState() {
    this.fileStatus.className = 'file-status processing';
    this.fileStatus.textContent = '⏳ Processing PDF...';
}

showPDFLoaded() {
    this.fileStatus.className = 'file-status success';
    this.fileStatus.textContent = `✅ ${this.fileName}`;
}

resetUploadState() {
    this.fileStatus.className = 'file-status';
    this.fileStatus.textContent = '';
}
resetshowpdf(){
    // Reset PDF state
    this.currentFile = null;

    // Clear PDF preview
    const iframe = document.getElementById("pdf-preview");
    iframe.src = "";

    document.getElementById("pdf-preview-container").style.display = "none";

}

enableChat() {
    this.messageInput.disabled = false;
    this.sendButton.disabled = false;
    this.messageInput.placeholder = 'Ask your question...';
}

showChatInterface() {
    this.welcomeScreen.style.display = 'none';
    this.messagesContainer.style.display = 'block';
    this.messageInput.focus();
}

    async sendMessage() {
    const message = this.messageInput.value.trim();
    if (!message || this.isProcessing) {
        console.log('sendMessage: No message or already processing.');
        return;
    }

    this.isProcessing = true;
    this.addMessage(message, 'user', false, null);
    this.messageInput.value = '';
    this.autoResizeTextarea();

    const loadingMsg = this.addMessage('AI is typing...', 'assistant', true, null);
    this.messageInput.disabled = true;
    this.sendButton.disabled = true;

    try {
        console.log('sendMessage: Sending fetch to /chat/');
        const response = await fetch('http://127.0.0.1:8000/chat/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: message })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API failed:', errorText);
            throw new Error('API failed: ' + errorText);
        }

        const data = await response.json();
        console.log('sendMessage: Received data', data);

        loadingMsg.remove();
        // Use typewriter effect for AI response
        this.addMessage('', 'assistant', false, data.sources, data.response);
    } catch (err) {
        console.error('sendMessage error:', err);
        loadingMsg.remove();
        this.addMessage('Error processing your request.', 'assistant', false, null);
        this.showNotification('Error: ' + err.message, 'error');
    } finally {
        this.isProcessing = false;
        this.messageInput.disabled = false;
        this.sendButton.disabled = false;
        this.messageInput.focus();
    }
}

// Add avatar and typewriter support
addMessage(content, type, isLoading = false, sources = null, typewriterText = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.style.opacity = 0;
    setTimeout(() => { messageDiv.style.opacity = 1; }, 10);

    // Avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = this.avatars[type] || '';
    messageDiv.appendChild(avatarDiv);

    // Message content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    if (isLoading) {
        contentDiv.innerHTML = `Thinking <div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
    } else if (typewriterText) {
        // Typewriter effect for AI
        this.typeWriterEffect(contentDiv, typewriterText, sources);
    } else {
        contentDiv.innerHTML = content;
        // show the sources if available
        if (sources && Array.isArray(sources) && sources.length > 0) {
            let html = `<ul class='sources-list'>`;
            sources.forEach(src => {
                html += `<li class='source-item'>Page ${src.page}: <span class='source-snippet'>${src.snippet}</span></li>`;
            });
            html += `</ul>`;
            contentDiv.innerHTML += html;
        }
    }
    messageDiv.appendChild(contentDiv);

    this.messagesContainer.appendChild(messageDiv);
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    return messageDiv;
}

// Typewriter effect for AI responses
typeWriterEffect(contentDiv, text, sources, i = 0) {
    if (i < text.length) {
        contentDiv.innerHTML = text.slice(0, i + 1);
        setTimeout(() => this.typeWriterEffect(contentDiv, text, sources, i + 1), 15);
    } else {
        // Add sources after typing is done
        if (sources && Array.isArray(sources) && sources.length > 0) {
            let html = `<ul class='sources-list'>`;
            sources.forEach(src => {
                html += `<li class='source-item'>Page ${src.page}: <span class='source-snippet'>${src.snippet}</span></li>`;
            });
            html += `</ul>`;
            contentDiv.innerHTML += html;
        }
    }
}
// notification function

// showNotification(message, type = 'success') {
//     let notification = document.createElement('div');
//     notification.className = `success-notification ${type}`;
//     notification.textContent = message;
//     document.body.appendChild(notification);

// }


showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `pdf-notification ${type}`;
    notification.innerHTML = `
      <div class="pdf-notification-progress">
        <div class="pdf-notification-progress-bar" style="animation-duration: ${duration}ms"></div>
      </div>
      <div>${message}</div>
    `;

    this.notificationContainer.appendChild(notification);
    this.notificationQueue.push(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);

    // Auto-dismiss
    setTimeout(() => {
        this.dismissNotification(notification);
    }, duration);

    // Click to dismiss
    notification.addEventListener('click', () => {
        this.dismissNotification(notification);
    });
}

dismissNotification(notification) {
    if (!notification) return;

    notification.classList.remove('active');
    notification.classList.add('exiting');

    setTimeout(() => {
        notification.remove();
        this.notificationQueue = this.notificationQueue.filter(n => n !== notification);
    }, 450);
}
// end of notification function

autoResizeTextarea() {
    const textarea = this.messageInput;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

newChat() {
    this.showNotification('new chat')
    this.pdfText = '';
    this.fileName = '';
    this.conversationHistory = [];
    this.isProcessing = false;

    this.messagesContainer.innerHTML = '';
    this.messagesContainer.style.display = 'none';
    this.welcomeScreen.style.display = 'flex';

    this.messageInput.disabled = true;
    this.sendButton.disabled = true;
    this.messageInput.placeholder = 'Upload a PDF to start...';
    this.messageInput.value = '';
    this.resetshowpdf()
    this.resetUploadState();
}
}

const app = new PDFChatApp();



