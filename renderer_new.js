const messagesContainer = document.getElementById('messages');
const commandInput = document.getElementById('commandInput');

let isProcessing = false;
let bootCompleted = false;
let audioContext = null;
let audioInitialized = false;

// Enhanced Audio System
function initializeAudioContext() {
    if (audioContext || audioInitialized) return;
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioInitialized = true;
        console.log('Audio context initialized:', audioContext.state);
        
        // Resume if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                console.log('Audio context resumed');
            });
        }
    } catch (e) {
        console.log('Audio not supported, continuing without sound');
    }
}

function generateBootAudio() {
    initializeAudioContext();
    if (audioContext) {
        playEnhancedBootSequence();
    }
}

function playEnhancedBootSequence() {
    if (!audioContext) return;
    
    // Initial deep bass rumble
    setTimeout(() => playDeepRumble(), 0);
    
    // Sacred chime sequence
    setTimeout(() => playSacredChime(440), 1000);
    setTimeout(() => playSacredChime(554), 1500);
    setTimeout(() => playSacredChime(659), 2000);
    
    // Mechanical activation sounds
    setTimeout(() => playMechanicalActivation(), 2500);
    setTimeout(() => playMechanicalActivation(), 3500);
    
    // Data stream sounds
    setTimeout(() => playDataStream(), 4000);
    setTimeout(() => playDataStream(), 5000);
    
    // Final power-up chord
    setTimeout(() => playPowerUpChord(), 6500);
}

function playDeepRumble() {
    if (!audioContext) return;
    
    const currentTime = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(40, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(60, currentTime + 2);
    oscillator.frequency.exponentialRampToValueAtTime(35, currentTime + 4);
    oscillator.type = 'sine';
    
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(100, currentTime);
    
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, currentTime + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.08, currentTime + 3);
    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 4);
    
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 4);
}

function playSacredChime(frequency) {
    if (!audioContext) return;
    
    const currentTime = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const reverbGain = audioContext.createGain();
    const delayNode = audioContext.createDelay();
    
    oscillator.connect(gainNode);
    oscillator.connect(delayNode);
    delayNode.connect(reverbGain);
    gainNode.connect(audioContext.destination);
    reverbGain.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.2, currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(frequency, currentTime + 0.5);
    oscillator.type = 'sine';
    
    delayNode.delayTime.setValueAtTime(0.3, currentTime);
    reverbGain.gain.setValueAtTime(0.3, currentTime);
    
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 2);
    
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 2);
}

function playMechanicalActivation() {
    if (!audioContext) return;
    
    const currentTime = audioContext.currentTime;
    const noiseBuffer = createNoiseBuffer(0.3);
    const noiseSource = audioContext.createBufferSource();
    const filterNode = audioContext.createBiquadFilter();
    const gainNode = audioContext.createGain();
    
    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    filterNode.type = 'bandpass';
    filterNode.frequency.setValueAtTime(800, currentTime);
    filterNode.frequency.exponentialRampToValueAtTime(200, currentTime + 0.2);
    filterNode.Q.setValueAtTime(10, currentTime);
    
    gainNode.gain.setValueAtTime(0.1, currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.3);
    
    noiseSource.start(currentTime);
    noiseSource.stop(currentTime + 0.3);
}

function playDataStream() {
    if (!audioContext) return;
    
    const currentTime = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(1200, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1800, currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(600, currentTime + 0.5);
    oscillator.type = 'square';
    
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(2000, currentTime);
    filterNode.frequency.exponentialRampToValueAtTime(800, currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.05, currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.5);
    
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.5);
}

function playPowerUpChord() {
    if (!audioContext) return;
    
    const currentTime = audioContext.currentTime;
    const frequencies = [220, 277, 330, 440]; // A minor chord
    
    frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 3);
        
        oscillator.start(currentTime + index * 0.1);
        oscillator.stop(currentTime + 3);
    });
}

function createNoiseBuffer(duration) {
    const sampleRate = audioContext.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
}

function playTypingSound() {
    if (!audioContext) return;
    
    const currentTime = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(1200 + Math.random() * 400, currentTime);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.03, currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.05);
    
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.05);
}

// Boot sequence functions
function initializeProtocolItems() {
    const protocolItems = document.querySelectorAll('.protocol-item');
    protocolItems.forEach(item => {
        item.addEventListener('click', function() {
            const command = this.dataset.command;
            if (command) {
                commandInput.value = command;
                processCommand();
            }
        });
    });
}

// Enhanced Boot sequence
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('booting');
    
    generateBootAudio();
    addEnhancedTypingSounds();
    animateLoadingPercentage();
    
    setTimeout(() => {
        bootCompleted = true;
        document.body.classList.remove('booting');
        
        initializeProtocolItems();
        initializeAmbientToggle();
        initializeDataTerminal();
        commandInput.focus();
    }, 7000); // Reduced to 7 seconds for faster transition
});

// Focus management and audio activation
document.addEventListener('click', (e) => {
    if (bootCompleted) {
        // Ensure audio context is activated on first user interaction
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                console.log('Audio context resumed after user interaction');
            });
        }
        
        if (!e.target.closest('.message-content')) {
            commandInput.focus();
        }
    }
});

// Also activate audio on first keypress
document.addEventListener('keydown', (e) => {
    if (bootCompleted && audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('Audio context resumed after keypress');
        });
    }
});

// Input handling
commandInput.addEventListener('keydown', async (e) => {
    if (!bootCompleted) return;
    
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        processCommand();
    }
});

async function processCommand() {
    const input = commandInput.value.trim();
    if (!input || isProcessing) return;
    
    isProcessing = true;
    addMessage(input, 'user');
    commandInput.value = '';
    
    if (input.startsWith('/')) {
        await handleSlashCommand(input);
    } else {
        await handleChatMessage(input);
    }
    
    isProcessing = false;
    commandInput.focus();
}

async function handleSlashCommand(input) {
    const parts = input.split(' ');
    const command = parts[0].substring(1).toLowerCase();
    const args = parts.slice(1);
    
    const loadingMessage = addMessage('Processing sacred protocol...', 'ai', true);
    
    try {
        const result = await window.electronAPI.executeCommand(command, args);
        
        if (loadingMessage) loadingMessage.remove();
        
        if (result.success && result.message === 'clear-screen') {
            clearChat();
            return;
        }
        
        if (result.success) {
            addMessage(result.message, 'ai');
        } else {
            addMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Command execution failed:', error);
        if (loadingMessage) loadingMessage.remove();
        addMessage('Sacred protocol failed. The machine spirit requires appeasement.', 'error');
    }
}

async function handleChatMessage(input) {
    const loadingMessage = addMessage('The machine spirit contemplates your words...', 'ai', true);
    
    try {
        const result = await window.electronAPI.chat(input);
        
        if (loadingMessage) loadingMessage.remove();
        
        if (result.success) {
            addMessage(result.message, 'ai');
        } else {
            addMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Chat failed:', error);
        if (loadingMessage) loadingMessage.remove();
        addMessage('The machine spirit dwells in silence. Use /help for protocols.', 'error');
    }
}

function addMessage(content, type = 'ai', isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    // Increment message counter for user messages
    if (type === 'user') {
        incrementMessageCount();
    }
    
    // Create header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'message-icon';
    iconDiv.textContent = type === 'user' ? '👤' : type === 'ai' ? '⚙️' : '💀';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'message-title';
    titleDiv.textContent = type === 'user' ? 'TECH-ADEPT' : 
                           type === 'ai' ? 'MACHINE SPIRIT' : 'SERVO SKULL';
    
    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'message-timestamp';
    timestampDiv.textContent = new Date().toLocaleTimeString();
    
    headerDiv.appendChild(iconDiv);
    headerDiv.appendChild(titleDiv);
    headerDiv.appendChild(timestampDiv);
    
    // Create content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (isLoading) {
        contentDiv.innerHTML = '<div class="loading">●●●</div>';
    } else {
        contentDiv.innerHTML = formatMessage(content);
    }
    
    messageDiv.appendChild(headerDiv);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Add subtle entrance animation
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 50);
    
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 50);
    
    return messageDiv;
}

function formatMessage(content) {
    if (!content) return '';
    
    console.log('Original content:', content);
    
    let formatted = content
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/\n/g, '<br>');
    
    // Handle spoiler tags
    formatted = formatted.replace(/\|\|(.*?)\|\|/g, '<span class="spoiler">$1</span>');
    
    console.log('Formatted content:', formatted);
    
    return formatted;
}

function clearChat() {
    const systemMessage = messagesContainer.querySelector('.message.system-message');
    messagesContainer.innerHTML = '';
    if (systemMessage) {
        messagesContainer.appendChild(systemMessage);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        clearChat();
    }
    
    if (e.key === 'Escape') {
        commandInput.focus();
        commandInput.select();
    }
});

// Ambient effects control
let ambientEnabled = true;
let ambientAudioNode = null;
let ambientGainNode = null;

function initializeAmbientToggle() {
    const ambientToggle = document.getElementById('ambientToggle');
    if (ambientToggle) {
        ambientToggle.classList.add('active'); // Start with ambience on
        
        // Start ambient sounds when UI loads
        setTimeout(() => startAmbientAudio(), 500);
        
        ambientToggle.addEventListener('click', () => {
            console.log('Ambient toggle clicked!');
            
            // Ensure audio context is activated
            if (!audioContext) {
                console.log('Creating audio context...');
                try {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    console.log('Audio context created:', audioContext.state);
                } catch (e) {
                    console.error('Failed to create audio context:', e);
                    return;
                }
            }
            
            if (audioContext.state === 'suspended') {
                console.log('Resuming suspended audio context...');
                audioContext.resume().then(() => {
                    console.log('Audio context resumed');
                    
                    // Play a test beep to verify audio is working
                    playTestBeep();
                    
                    // Initialize ambient audio if not already started
                    if (!ambientAudioNode) {
                        console.log('Starting ambient audio from toggle click');
                        startAmbientAudio();
                    }
                });
            } else {
                console.log('Audio context state:', audioContext.state);
                
                // Play a test beep to verify audio is working
                playTestBeep();
                
                // Initialize ambient audio if not already started
                if (!ambientAudioNode) {
                    console.log('Starting ambient audio from toggle click');
                    startAmbientAudio();
                }
            }
            
            ambientEnabled = !ambientEnabled;
            ambientToggle.classList.toggle('active', ambientEnabled);
            
            const dataStreamBg = document.querySelector('.data-stream-bg');
            const scrollTicker = document.querySelector('.sacred-scroll-ticker');
            
            if (dataStreamBg) {
                dataStreamBg.style.opacity = ambientEnabled ? '0.12' : '0';
            }
            
            if (scrollTicker) {
                scrollTicker.style.display = ambientEnabled ? 'block' : 'none';
            }
            
            // Control ambient audio
            toggleAmbientAudio(ambientEnabled);
            
            // Show a brief status message
            const statusText = ambientToggle.querySelector('.toggle-text');
            const originalText = statusText.textContent;
            statusText.textContent = ambientEnabled ? 'ENABLED' : 'DISABLED';
            
            setTimeout(() => {
                statusText.textContent = originalText;
            }, 1000);
        });
    }
}

function startAmbientAudio() {
    if (!audioContext) {
        console.error('No audio context available for ambient audio');
        return;
    }
    
    if (ambientAudioNode) {
        console.log('Ambient audio already running');
        return;
    }
    
    try {
        // Ensure audio context is running
        if (audioContext.state === 'suspended') {
            console.log('Audio context suspended, cannot start ambient audio yet');
            return;
        }
        
        console.log('Starting ambient audio... Audio context state:', audioContext.state);
        
        // Create the continuous machine hum
        ambientAudioNode = audioContext.createOscillator();
        ambientGainNode = audioContext.createGain();
        
        // Configure for a deep machine hum - use a low frequency
        ambientAudioNode.frequency.setValueAtTime(80, audioContext.currentTime); // Deep hum like machinery
        ambientAudioNode.type = 'sine'; // Smooth sine wave for continuous hum
        
        // Connect directly
        ambientAudioNode.connect(ambientGainNode);
        ambientGainNode.connect(audioContext.destination);
        
        // Set volume for constant background hum
        ambientGainNode.gain.setValueAtTime(0, audioContext.currentTime);
        ambientGainNode.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 3); // Gentle fade-in
        
        // Start the continuous hum - this should run indefinitely
        ambientAudioNode.start();
        
        console.log('Continuous ambient hum started at 80Hz with volume 0.02');
        
        // Reduce frequency of mechanical sounds to be less intrusive
        setTimeout(() => {
            setInterval(() => {
                if (ambientEnabled && Math.random() < 0.2) { // 20% chance, less frequent
                    playSubtleMechanicalSound();
                }
            }, 8000); // Every 8 seconds instead of 4
        }, 5000); // Wait 5 seconds before starting mechanical sounds
        
    } catch (e) {
        console.error('Ambient audio failed to start:', e);
    }
}

function toggleAmbientAudio(enabled) {
    if (!ambientGainNode) {
        console.log('No ambient gain node to toggle');
        return;
    }
    
    const currentTime = audioContext.currentTime;
    if (enabled) {
        ambientGainNode.gain.linearRampToValueAtTime(0.02, currentTime + 1); // Constant background hum volume
        console.log('Ambient hum enabled');
    } else {
        ambientGainNode.gain.linearRampToValueAtTime(0, currentTime + 1);
        console.log('Ambient hum disabled');
    }
}

function playSubtleMechanicalSound() {
    if (!audioContext || !ambientEnabled) return;
    
    console.log('Playing subtle mechanical sound...');
    
    const currentTime = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // More subtle mechanical sounds - lower frequencies for machinery
    const freq = 120 + Math.random() * 280; // 120-400Hz range (more machine-like)
    oscillator.frequency.setValueAtTime(freq, currentTime);
    oscillator.type = 'square'; // Square wave for mechanical quality
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Much more subtle volume to blend with ambient hum
    gainNode.gain.setValueAtTime(0.005, currentTime); // Very quiet
    gainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + 0.2);
    
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.2);
    
    console.log('Subtle mechanical sound played at', freq, 'Hz');
}

// Sacred Data Terminal functionality
let messageCount = 0;
let startTime = Date.now();

function initializeDataTerminal() {
    // Initialize quick command buttons
    const quickButtons = document.querySelectorAll('.quick-cmd');
    quickButtons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.dataset.command;
            if (command) {
                commandInput.value = command;
                commandInput.focus();
                // Auto-submit common commands
                if (command === '/help' || command === '/clear' || command === '/status') {
                    processCommand();
                }
            }
        });
    });
    
    // Start uptime counter
    updateMetrics();
    setInterval(updateMetrics, 1000);
}

function updateMetrics() {
    const uptimeElement = document.getElementById('uptime');
    const messageCountElement = document.getElementById('messageCount');
    
    if (uptimeElement) {
        const elapsed = Date.now() - startTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        uptimeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (messageCountElement) {
        messageCountElement.textContent = messageCount.toString();
    }
    
    // Update system vitals every 5 seconds
    if (Date.now() % 5000 < 1000) {
        updateSystemVitals();
    }
}

// System vitals monitoring
function updateSystemVitals() {
    const powerLevel = document.getElementById('powerLevel');
    const temperature = document.getElementById('temperature');
    const signalStrength = document.getElementById('signalStrength');
    
    if (powerLevel) {
        // Simulate power level fluctuation
        const power = 95 + Math.random() * 5;
        powerLevel.textContent = `${Math.floor(power)}%`;
        powerLevel.style.color = power > 97 ? 'var(--status-active)' : 'var(--status-warning)';
    }
    
    if (temperature) {
        // Random temperature status
        const temps = ['OPTIMAL', 'STABLE', 'COOL', 'NOMINAL'];
        temperature.textContent = temps[Math.floor(Math.random() * temps.length)];
    }
    
    if (signalStrength) {
        // Random signal status
        const signals = ['STRONG', 'STABLE', 'CLEAR', 'OPTIMAL'];
        signalStrength.textContent = signals[Math.floor(Math.random() * signals.length)];
    }
}

function incrementMessageCount() {
    messageCount++;
    updateMetrics();
}

// Enhanced boot sequence with loading percentage
function animateLoadingPercentage() {
    const percentageElement = document.querySelector('.loading-percentage');
    if (!percentageElement) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 3 + 1; // Random increment between 1-4
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        percentageElement.textContent = Math.floor(progress) + '%';
    }, 70); // Update every 70ms for smooth animation
}

// Enhanced typing sounds for boot sequence
function addEnhancedTypingSounds() {
    const statusLines = document.querySelectorAll('.status-line');
    statusLines.forEach((line, index) => {
        const delay = parseInt(line.dataset.delay) || (index * 1500);
        setTimeout(() => {
            playTypingSound();
            // Add multiple typing sounds for longer lines
            if (line.textContent.length > 20) {
                setTimeout(() => playTypingSound(), 100);
                setTimeout(() => playTypingSound(), 200);
            }
        }, delay);
    });
}

// Test beep function to verify audio is working
function playTestBeep() {
    if (!audioContext) {
        console.error('No audio context for test beep');
        return;
    }
    
    console.log('Playing test beep...');
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    console.log('Test beep played');
}
