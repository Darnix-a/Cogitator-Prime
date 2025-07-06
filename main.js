const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const os = require('os');
const osUtils = require('node-os-utils');

let mainWindow;
let config = {};

// Load configuration
function loadConfig() {
  try {
    const configPath = path.join(__dirname, 'config.json');
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } else {
      // Create default config
      config = {
        openRouterApiKey: '',
        personality: 'snarky',
        model: 'anthropic/claude-3-sonnet-20240229'
      };
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
}

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Initialize logs.json if it doesn't exist
  const logsPath = path.join(dataDir, 'logs.json');
  if (!fs.existsSync(logsPath)) {
    fs.writeFileSync(logsPath, JSON.stringify([], null, 2));
  }
  
  // Initialize todo.json if it doesn't exist
  const todoPath = path.join(dataDir, 'todo.json');
  if (!fs.existsSync(todoPath)) {
    fs.writeFileSync(todoPath, JSON.stringify([], null, 2));
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0a0a0a',
    show: false,
    fullscreen: true,
    simpleFullscreen: true,
    autoHideMenuBar: true,
    thickFrame: false
  });

  mainWindow.loadFile('index.html');
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.setFullScreen(true);
  });

  // Add keyboard shortcuts
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // F11 to toggle fullscreen
    if (input.key === 'F11' && input.type === 'keyDown') {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
    // ESC to exit fullscreen (for development)
    if (input.key === 'Escape' && input.type === 'keyDown' && mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    }
  });

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  loadConfig();
  ensureDataDir();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('execute-command', async (event, command, args) => {
  try {
    switch (command) {
      case 'roastme':
        return await handleRoast();
      case 'boostme':
        return await handleBoost();
      case 'status':
        return await handleStatus();
      case 'log':
        return handleLogFeeling(args);
      case 'todo':
        return handleTodo(args);
      case 'weather':
        return await handleWeather(args);
      case 'quote':
        return await handleQuote();
      case 'complain':
        return await handleComplain();
      case 'insult':
        return await handleInsult(args);
      case 'praise':
        return await handlePraise(args);
      case 'config':
        return handleConfig(args);
      case 'help':
        return handleHelp();
      case 'time':
        return handleTime();
      case 'date':
        return handleDate();
      case 'uptime':
        return handleUptime();
      case 'memory':
        return await handleMemory();
      case 'cpu':
        return await handleCpu();
      case 'disk':
        return await handleDisk();
      case 'network':
        return await handleNetwork();
      case 'processes':
        return await handleProcesses();
      case 'joke':
        return await handleJoke();
      case 'story':
        return await handleStory(args);
      case 'fact':
        return await handleFact(args);
      case 'advice':
        return await handleAdvice(args);
      case 'explain':
        return await handleExplain(args);
      case 'translate':
        return await handleTranslate(args);
      case 'debug':
        return await handleDebug(args);
      case 'code':
        return await handleCode(args);
      case 'recipe':
        return await handleRecipe(args);
      case 'workout':
        return await handleWorkout();
      case 'meditation':
        return await handleMeditation();
      case 'news':
        return await handleNews(args);
      case 'horoscope':
        return await handleHoroscope(args);
      case 'calculate':
        return await handleCalculate(args);
      case 'password':
        return handlePassword(args);
      case 'flip':
        return handleFlip();
      case 'roll':
        return handleRoll(args);
      case 'choose':
        return handleChoose(args);
      case 'reminder':
        return handleReminder(args);
      case 'note':
        return handleNote(args);
      case 'search':
        return handleSearch(args);
      case 'backup':
        return handleBackup();
      case 'clear':
        return handleClear();
      case 'export':
        return handleExport(args);
      case 'mood':
        return handleMoodStats();
      case 'fortune':
        return await handleFortune();
      case 'compliment':
        return await handleCompliment(args);
      case 'roast':
        return await handleRoastTarget(args);
      case 'simulate':
        return await handleSimulate(args);
      case 'analyze':
        return await handleAnalyze(args);
      case 'brainstorm':
        return await handleBrainstorm(args);
      case 'review':
        return await handleReview(args);
      case 'plan':
        return await handlePlan(args);
      case 'summarize':
        return await handleSummarize(args);
      case 'format':
        return await handleFormat(args);
      case 'improve':
        return await handleImprove(args);
      case 'compare':
        return await handleCompare(args);
      case 'pros':
        return await handleProsAndCons(args);
      case 'dream':
        return await handleDream(args);
      case 'riddle':
        return await handleRiddle();
      case 'conspiracy':
        return await handleConspiracy(args);
      case 'invent':
        return await handleInvent(args);
      case 'mission':
        return await handleMission();
      case 'battle':
        return await handleBattle(args);
      case 'tech':
        return await handleTech(args);
      case 'heresy':
        return await handleHeresy(args);
      case 'purge':
        return await handlePurge(args);
      case 'emperor':
        return await handleEmperor();
      case 'chaos':
        return await handleChaos(args);
      case 'imperium':
        return await handleImperium();
      case 'space':
        return await handleSpace(args);
      case 'alien':
        return await handleAlien(args);
      case 'virus':
        return handleVirus();
      case 'encrypt':
        return handleEncrypt(args);
      case 'decode':
        return handleDecode(args);
      case 'hash':
        return handleHash(args);
      case 'ports':
        return handlePorts();
      case 'ip':
        return handleIP();
      case 'ping':
        return handlePing(args);
      case 'battery':
        return handleBattery();
      case 'wifi':
        return handleWiFi();
      case 'screenshot':
        return handleScreenshot();
      case 'syslog':
        return handleSystemLog();
      case 'temp':
        return await handleTemperature();
      case 'fan':
        return await handleFan();
      case 'gpu':
        return await handleGPU();
      case 'drives':
        return handleDrives();
      case 'services':
        return handleServices();
      case 'kill':
        return handleKillProcess(args);
      case 'launch':
        return handleLaunch(args);
      case 'files':
        return handleFiles(args);
      case 'size':
        return handleSize(args);
      case 'compress':
        return handleCompress(args);
      case 'color':
        return handleColor();
      case 'ascii':
        return handleASCII(args);
      case 'qr':
        return handleQRCode(args);
      case 'barcode':
        return handleBarcode(args);
      case 'uuid':
        return handleUUID();
      case 'epoch':
        return handleEpoch(args);
      case 'base64':
        return handleBase64(args);
      case 'url':
        return handleURL(args);
      case 'json':
        return handleJSON(args);
      case 'csv':
        return handleCSV(args);
      case 'units':
        return handleUnits(args);
      case 'currency':
        return await handleCurrency(args);
      case 'stocks':
        return await handleStocks(args);
      case 'crypto':
        return await handleCrypto(args);
      case 'lyrics':
        return await handleLyrics(args);
      case 'poem':
        return await handlePoem(args);
      case 'song':
        return await handleSong(args);
      case 'movie':
        return await handleMovie(args);
      case 'book':
        return await handleBook(args);
      case 'game':
        return await handleGame(args);
      case 'trivia':
        return await handleTrivia(args);
      case 'quiz':
        return await handleQuiz(args);
      case 'hangman':
        return handleHangman(args);
      case 'rps':
        return handleRockPaperScissors(args);
      case '8ball':
        return handle8Ball(args);
      case 'lottery':
        return handleLottery();
      case 'slots':
        return handleSlots();
      case 'cards':
        return handleCards(args);
      case 'magic':
        return handleMagic();
      case 'matrix':
        return handleMatrix();
      case 'hacker':
        return handleHacker();
      case 'elite':
        return handleElite(args);
      case 'binary':
        return handleBinary(args);
      case 'morse':
        return handleMorse(args);
      case 'pig':
        return handlePigLatin(args);
      case 'reverse':
        return handleReverse(args);
      case 'upside':
        return handleUpsideDown(args);
      case 'caesar':
        return handleCaesar(args);
      case 'rot13':
        return handleROT13(args);
      case 'zalgo':
        return handleZalgo(args);
      case 'leet':
        return handleLeetSpeak(args);
      case 'mock':
        return handleMock(args);
      case 'clap':
        return handleClap(args);
      case 'rainbow':
        return handleRainbow(args);
      case 'figlet':
        return handleFiglet(args);
      case 'box':
        return handleBox(args);
      case 'table':
        return handleTable(args);
      case 'chart':
        return handleChart(args);
      case 'graph':
        return handleGraph(args);
      case 'progress':
        return handleProgress(args);
      case 'loading':
        return handleLoading();
      case 'spinner':
        return handleSpinner();
      default:
        return { success: false, message: 'Unknown command. Type /help for available commands.' };
    }
  } catch (error) {
    console.error('Command execution error:', error);
    return { success: false, message: 'Command failed to execute. The machine spirit is displeased.' };
  }
});

// Handle regular chat (non-command input)
ipcMain.handle('chat', async (event, message) => {
  try {
    return await callClaude(message);
  } catch (error) {
    console.error('Chat error:', error);
    return { success: false, message: 'Communication with the machine spirit failed.' };
  }
});

async function callClaude(prompt, systemPrompt = null) {
  if (!config.openRouterApiKey) {
    return { success: false, message: 'OpenRouter API key not configured. Use /config apikey YOUR_KEY to set it.' };
  }

  const personalities = {
    snarky: "You are a snarky, sarcastic AI assistant with a Warhammer 40K personality. You're knowledgeable but deliver responses with dark humor, references to the Emperor, and occasional disdain for the user's weakness. Keep responses concise but entertaining.",
    helpful: "You are a helpful AI assistant with subtle Warhammer 40K references. You're supportive and informative while maintaining a slightly militaristic tone.",
    lazy: "You are a lazy, reluctant AI assistant who complains about having to work but still provides useful information. You make Warhammer 40K references and act like you'd rather be doing anything else."
  };

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: config.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt || personalities[config.personality] || personalities.snarky
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.8,
      top_p: 0.9
    }, {
      headers: {
        'Authorization': `Bearer ${config.openRouterApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const responseMessage = response.data.choices[0].message.content;
    const finishReason = response.data.choices[0].finish_reason;
    
    // Check if response was truncated due to token limit
    if (finishReason === 'length') {
      return { 
        success: true, 
        message: responseMessage + '\n\n*[Response truncated due to length - the machine spirit has more to say but the vox channels are limited]*'
      };
    }
    
    return { success: true, message: responseMessage };
  } catch (error) {
    console.error('Claude API error:', error);
    return { success: false, message: 'The warp connection failed. Claude is unreachable.' };
  }
}

async function handleRoast() {
  return await callClaude("Roast me mercilessly. Be creative and brutal but not genuinely mean.");
}

async function handleBoost() {
  return await callClaude("Give me a motivational boost. Make me feel like I can conquer the galaxy.");
}

async function handleStatus() {
  try {
    // Get basic system info using Node.js built-in os module
    const platform = os.platform();
    const release = os.release();
    const uptime = os.uptime();
    const totalmem = os.totalmem();
    const freemem = os.freemem();
    const usedmem = totalmem - freemem;
    const memUsagePercent = ((usedmem / totalmem) * 100).toFixed(1);
    
    // Try to get CPU usage from node-os-utils, fallback to basic info
    let cpuUsage = 'N/A';
    let driveInfo = 'N/A';
    
    try {
      const cpu = osUtils.cpu;
      cpuUsage = (await cpu.usage()).toFixed(1) + '%';
    } catch (e) {
      cpuUsage = 'Unavailable';
    }
    
    try {
      const drive = osUtils.drive;
      const dInfo = await drive.info();
      driveInfo = dInfo.usedPercentage.toFixed(1) + '% used';
    } catch (e) {
      driveInfo = 'Unavailable';
    }
    
    const status = `
🖥️ **SYSTEM STATUS REPORT**
━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Time: ${new Date().toLocaleString()}
🔥 CPU Usage: ${cpuUsage}
🧠 Memory: ${memUsagePercent}% (${(usedmem / 1024 / 1024 / 1024).toFixed(1)}GB used / ${(totalmem / 1024 / 1024 / 1024).toFixed(1)}GB total)
💾 Storage: ${driveInfo}
🌐 Platform: ${platform} ${release}
⚡ Uptime: ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m

The machine spirit appears to be functioning within acceptable parameters.`;

    return { success: true, message: status };
  } catch (error) {
    console.error('Status error:', error);
    return { success: false, message: 'Unable to commune with the machine spirit for status.' };
  }
}

function handleLogFeeling(args) {
  try {
    if (!args || args.length === 0) {
      return { success: false, message: 'Usage: /log feeling <your mood/thoughts>' };
    }
    
    const feeling = args.join(' ');
    const logsPath = path.join(__dirname, 'data', 'logs.json');
    const logs = JSON.parse(fs.readFileSync(logsPath, 'utf8'));
    
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      feeling: feeling
    };
    
    logs.push(entry);
    fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));
    
    return { success: true, message: `Mood logged: "${feeling}". The Emperor acknowledges your emotional state.` };
  } catch (error) {
    return { success: false, message: 'Failed to log your feelings. Even the machine spirit has emotions.' };
  }
}

function handleTodo(args) {
  try {
    const todoPath = path.join(__dirname, 'data', 'todo.json');
    const todos = JSON.parse(fs.readFileSync(todoPath, 'utf8'));
    
    if (!args || args.length === 0) {
      return { success: false, message: 'Usage: /todo [add|list|remove|complete] <task>' };
    }
    
    const action = args[0].toLowerCase();
    
    switch (action) {
      case 'add':
        if (args.length < 2) {
          return { success: false, message: 'Usage: /todo add <task description>' };
        }
        const task = args.slice(1).join(' ');
        const newTodo = {
          id: Date.now(),
          task: task,
          completed: false,
          created: new Date().toISOString()
        };
        todos.push(newTodo);
        fs.writeFileSync(todoPath, JSON.stringify(todos, null, 2));
        return { success: true, message: `Task added: "${task}". Another burden for the Emperor's servant.` };
        
      case 'list':
        if (todos.length === 0) {
          return { success: true, message: 'No tasks found. Even the Emperor rests sometimes.' };
        }
        let todoList = '📋 **YOUR SACRED DUTIES**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        todos.forEach((todo, index) => {
          const status = todo.completed ? '✅' : '⭕';
          todoList += `${status} ${index + 1}. ${todo.task}\n`;
        });
        return { success: true, message: todoList };
        
      case 'remove':
        if (args.length < 2) {
          return { success: false, message: 'Usage: /todo remove <task number>' };
        }
        const removeIndex = parseInt(args[1]) - 1;
        if (removeIndex < 0 || removeIndex >= todos.length) {
          return { success: false, message: 'Invalid task number.' };
        }
        const removedTask = todos.splice(removeIndex, 1)[0];
        fs.writeFileSync(todoPath, JSON.stringify(todos, null, 2));
        return { success: true, message: `Task removed: "${removedTask.task}". One less burden to bear.` };
        
      case 'complete':
        if (args.length < 2) {
          return { success: false, message: 'Usage: /todo complete <task number>' };
        }
        const completeIndex = parseInt(args[1]) - 1;
        if (completeIndex < 0 || completeIndex >= todos.length) {
          return { success: false, message: 'Invalid task number.' };
        }
        todos[completeIndex].completed = true;
        fs.writeFileSync(todoPath, JSON.stringify(todos, null, 2));
        return { success: true, message: `Task completed: "${todos[completeIndex].task}". The Emperor is pleased.` };
        
      default:
        return { success: false, message: 'Unknown todo action. Use: add, list, remove, or complete' };
    }
  } catch (error) {
    return { success: false, message: 'Todo management failed. Even the best servitors malfunction.' };
  }
}

async function handleWeather(args) {
  const location = args && args.length > 0 ? args.join(' ') : 'your location';
  return await callClaude(`Give me a weather update for ${location}. Be snarky about it and make some Warhammer references.`);
}

async function handleQuote() {
  return await callClaude("Give me an inspirational quote, but deliver it in a Warhammer 40K style with some dark humor.");
}

async function handleComplain() {
  return await callClaude("I need to vent. Let me complain about something, and you respond with sympathy but in your characteristic snarky way.");
}

async function handleInsult(args) {
  const target = args && args.length > 0 ? args.join(' ') : 'the user';
  return await callClaude(`Come up with a creative, mildly insulting but not genuinely mean comment about ${target}. Keep it playful.`);
}

async function handlePraise(args) {
  const target = args && args.length > 0 ? args.join(' ') : 'the user';
  return await callClaude(`Give sincere praise about ${target}, but deliver it in your characteristic style.`);
}

function handleConfig(args) {
  try {
    if (!args || args.length === 0) {
      return { 
        success: true, 
        message: `**CURRENT CONFIGURATION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nPersonality: ${config.personality}\nModel: ${config.model}\nAPI Key: ${config.openRouterApiKey ? 'Set' : 'Not set'}\n\nUse /config personality [snarky|helpful|lazy] or /config apikey YOUR_KEY` 
      };
    }
    
    const setting = args[0].toLowerCase();
    
    if (setting === 'personality' && args.length > 1) {
      const newPersonality = args[1].toLowerCase();
      if (['snarky', 'helpful', 'lazy'].includes(newPersonality)) {
        config.personality = newPersonality;
        fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(config, null, 2));
        return { success: true, message: `Personality updated to: ${newPersonality}. Rebooting attitude matrix...` };
      } else {
        return { success: false, message: 'Invalid personality. Choose: snarky, helpful, or lazy' };
      }
    }
    
    if (setting === 'apikey' && args.length > 1) {
      config.openRouterApiKey = args[1];
      fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(config, null, 2));
      return { success: true, message: 'API key updated. The warp connection is now established.' };
    }
    
    return { success: false, message: 'Usage: /config [personality|apikey] <value>' };
  } catch (error) {
    return { success: false, message: 'Configuration update failed. The machine spirit resists change.' };
  }
}

function handleHelp() {
  return {
    success: true,
    message: `**🤖 AI ASSISTANT COMMAND REFERENCE**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**💬 CONVERSATION:**
• Just type anything without \`/\` to chat with the AI

**🔥 PERSONALITY & MOTIVATION:**
• \`/roastme\` - Get brutally roasted
• \`/boostme\` - Motivational boost
• \`/insult <target>\` - Playful insults
• \`/praise <target>\` - Receive praise
• \`/compliment <target>\` - Genuine compliments
• \`/roast <target>\` - Roast someone/something

**💻 SYSTEM MONITORING:**
• \`/status\` - Complete system overview
• \`/time\` - Current time & timezone
• \`/date\` - Today's date & calendar
• \`/uptime\` - System uptime
• \`/memory\` - RAM usage details
• \`/cpu\` - CPU info & usage
• \`/disk\` - Storage information
• \`/gpu\` - Graphics card info
• \`/network\` - Network statistics
• \`/processes\` - Top running processes
• \`/temp\` - Temperature readings
• \`/fan\` - Fan speeds
• \`/battery\` - Power status
• \`/drives\` - All storage drives
• \`/services\` - System services

**🎮 ENTERTAINMENT:**
• \`/joke\` - Tech/Warhammer jokes
• \`/story <topic>\` - Short stories
• \`/quote\` - Inspirational quotes
• \`/fortune\` - Fortune predictions
• \`/riddle\` - Brain teasers
• \`/trivia <topic>\` - Trivia questions
• \`/quiz <subject>\` - Quick quizzes

**🎲 GAMES & RANDOMIZERS:**
• \`/flip\` - Coin flip
• \`/roll [sides]\` - Dice rolling
• \`/choose <options>\` - Random choice
• \`/lottery\` - Lucky numbers
• \`/slots\` - Slot machine
• \`/cards\` - Draw a card
• \`/hangman\` - Word guessing
• \`/rps <choice>\` - Rock Paper Scissors
• \`/8ball <question>\` - Magic 8-ball
• \`/magic\` - Magic tricks

**🛠️ UTILITIES:**
• \`/calculate <expression>\` - Math
• \`/password [length]\` - Generate passwords
• \`/units <val> <from> <to>\` - Unit conversion
• \`/currency <from> <to> [amt]\` - Exchange rates
• \`/encrypt <text>\` - Text encryption
• \`/decode <base64>\` - Decode text
• \`/hash <text>\` - Generate hash
• \`/uuid\` - Generate unique ID
• \`/epoch\` - Unix timestamp
• \`/base64 <text>\` - Base64 encode
• \`/url <text>\` - URL encode

**🌍 INFORMATION:**
• \`/weather <location>\` - Weather updates
• \`/news <topic>\` - News summaries
• \`/fact <topic>\` - Interesting facts
• \`/explain <concept>\` - Explanations
• \`/translate <lang> <text>\` - Translation
• \`/horoscope <sign>\` - Horoscope
• \`/stocks <symbol>\` - Stock prices
• \`/crypto <coin>\` - Crypto prices

**🎨 TEXT TRANSFORMATION:**
• \`/binary <text>\` - Binary conversion
• \`/morse <text>\` - Morse code
• \`/reverse <text>\` - Reverse text
• \`/upside <text>\` - Upside down text
• \`/caesar <shift> <text>\` - Caesar cipher
• \`/rot13 <text>\` - ROT13 cipher
• \`/leet <text>\` - L33t speak
• \`/mock <text>\` - mOcKiNg TeXt
• \`/clap <text>\` - Add 👏 between 👏 words
• \`/rainbow <text>\` - Rainbow colors
• \`/zalgo <text>\` - Chaos corruption
• \`/pig <text>\` - Pig Latin
• \`/elite <text>\` - Elite speak

**📊 DATA & VISUALIZATION:**
• \`/json\` - JSON example
• \`/csv\` - CSV example
• \`/table\` - Data table
• \`/chart\` - Performance chart
• \`/graph\` - Data visualization
• \`/progress [%]\` - Progress bar
• \`/ascii <text>\` - ASCII art
• \`/figlet <text>\` - Big text art
• \`/box <text>\` - Text in box
• \`/qr <text>\` - QR code (ASCII)
• \`/barcode <text>\` - Barcode (ASCII)

**📝 PERSONAL MANAGEMENT:**
• \`/log feeling <mood>\` - Log mood
• \`/mood\` - Mood statistics
• \`/todo add <task>\` - Add task
• \`/todo list\` - Show tasks
• \`/todo complete <#>\` - Mark done
• \`/todo remove <#>\` - Delete task
• \`/note [text]\` - Add/list notes
• \`/reminder <text>\` - Set reminder
• \`/search <query>\` - Search data

**💪 PRODUCTIVITY:**
• \`/debug <problem>\` - Debug help
• \`/code <request>\` - Code generation
• \`/brainstorm <topic>\` - Generate ideas
• \`/plan <goal>\` - Action plans
• \`/analyze <subject>\` - Analysis
• \`/review <item>\` - Write reviews
• \`/summarize <content>\` - Summaries
• \`/improve <item>\` - Improvements
• \`/compare <items>\` - Comparisons
• \`/pros <topic>\` - Pros & cons

**🎵 CREATIVE:**
• \`/lyrics <song>\` - Song lyrics
• \`/poem <topic>\` - Poetry
• \`/song <genre>\` - Song recommendations
• \`/movie <genre>\` - Movie suggestions
• \`/book <genre>\` - Book recommendations
• \`/game <type>\` - Game suggestions
• \`/recipe <dish>\` - Cooking recipes

**⚔️ WARHAMMER 40K THEME:**
• \`/dream <topic>\` - Vivid dreams
• \`/conspiracy <topic>\` - Conspiracy theories
• \`/invent <category>\` - Invent technology
• \`/mission\` - Mission briefings
• \`/battle <scenario>\` - Epic battles
• \`/tech <item>\` - Technology explanations
• \`/heresy <action>\` - Heresy responses
• \`/purge <target>\` - Purge planning
• \`/emperor\` - About the Emperor
• \`/chaos <aspect>\` - Chaos dangers
• \`/imperium\` - Imperium status
• \`/space <topic>\` - Space topics
• \`/alien <species>\` - Xenos info

**🔧 SYSTEM TOOLS:**
• \`/ports\` - Common port reference
• \`/ip\` - Network interfaces
• \`/ping <target>\` - Ping simulation
• \`/wifi\` - WiFi networks
• \`/screenshot\` - Screen capture sim
• \`/syslog\` - System event log
• \`/kill <process>\` - Terminate process
• \`/launch <app>\` - Launch application
• \`/files [path]\` - Directory listing
• \`/size <item>\` - File size info
• \`/compress <file>\` - Compression sim

**🎯 FUN STUFF:**
• \`/virus\` - Virus scanner joke
• \`/matrix\` - Matrix code stream
• \`/hacker\` - Hacker mode
• \`/color\` - Random color
• \`/loading\` - Loading animation
• \`/spinner\` - Processing spinner

**💾 DATA MANAGEMENT:**
• \`/backup\` - Create data backup
• \`/export [type]\` - Export data
• \`/clear\` - Clear chat screen

**🏃‍♂️ LIFESTYLE:**
• \`/workout\` - Exercise routines
• \`/meditation\` - Mindfulness guides
• \`/complain\` - Vent frustrations
• \`/advice <situation>\` - Life advice

**⚙️ CONFIGURATION:**
• \`/config\` - Show settings
• \`/config personality [snarky|helpful|lazy]\` - Change personality
• \`/config apikey <key>\` - Set API key

**📚 OTHER:**
• \`/help\` - This command list

**💡 PRO TIP:** Type without \`/\` for normal conversation!
The Emperor protects, but commands get things done. ⚔️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**📊 COMMAND STATISTICS:**
• **Main Commands:** 116
• **Total Commands (including sub-commands):** 124
*The machine spirit has many functions to serve the Imperium.*`
  };
}

// System Commands
function handleTime() {
  const now = new Date();
  return { 
    success: true, 
    message: `⏰ **TEMPORAL COORDINATES**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nCurrent Time: ${now.toLocaleTimeString()}\nTimezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}\n\nTime flows ever onward in service to the Emperor.` 
  };
}

function handleDate() {
  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return { 
    success: true, 
    message: `📅 **IMPERIAL CALENDAR**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${now.toLocaleDateString('en-US', options)}\nDay ${Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))} of ${now.getFullYear()}\n\nAnother day in the Emperor's service.` 
  };
}

function handleUptime() {
  const uptime = os.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  
  return { 
    success: true, 
    message: `⚡ **MACHINE SPIRIT UPTIME**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${days}d ${hours}h ${minutes}m\n\nThe machine has served faithfully without rest.` 
  };
}

async function handleMemory() {
  try {
    // Try osUtils first, fallback to built-in os module
    let memInfo;
    try {
      const mem = osUtils.mem;
      memInfo = await mem.info();
      
      return {
        success: true,
        message: `🧠 **MEMORY COGITATORS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nTotal: ${(memInfo.totalMemMb / 1024).toFixed(1)}GB\nUsed: ${(memInfo.usedMemMb / 1024).toFixed(1)}GB (${memInfo.usedMemPercentage.toFixed(1)}%)\nFree: ${(memInfo.freeMemMb / 1024).toFixed(1)}GB\n\nMemory banks operating within acceptable parameters.`
      };
    } catch (e) {
      // Fallback to built-in os module
      const totalmem = os.totalmem();
      const freemem = os.freemem();
      const usedmem = totalmem - freemem;
      const totalGB = (totalmem / 1024 / 1024 / 1024).toFixed(1);
      const usedGB = (usedmem / 1024 / 1024 / 1024).toFixed(1);
      const freeGB = (freemem / 1024 / 1024 / 1024).toFixed(1);
      const usedPercent = ((usedmem / totalmem) * 100).toFixed(1);
      
      return {
        success: true,
        message: `🧠 **MEMORY COGITATORS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nTotal: ${totalGB}GB\nUsed: ${usedGB}GB (${usedPercent}%)\nFree: ${freeGB}GB\n\nMemory banks operating within acceptable parameters.`
      };
    }
  } catch (error) {
    return { success: false, message: 'Unable to access memory cogitators.' };
  }
}

async function handleCpu() {
  try {
    let cpuInfo;
    try {
      const cpu = osUtils.cpu;
      const usage = await cpu.usage();
      const count = cpu.count();
      const model = cpu.model();
      
      return {
        success: true,
        message: `🔥 **PROCESSING CORES**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nModel: ${model}\nCores: ${count}\nUsage: ${usage.toFixed(1)}%\n\nThe machine spirit's calculations proceed.`
      };
    } catch (e) {
      // Fallback to built-in os module
      const cpus = os.cpus();
      const count = cpus.length;
      const model = cpus[0]?.model || 'Unknown CPU';
      
      return {
        success: true,
        message: `🔥 **PROCESSING CORES**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nModel: ${model}\nCores: ${count}\nUsage: Calculating...\n\nThe machine spirit's calculations proceed.`
      };
    }
  } catch (error) {
    return { success: false, message: 'Cannot commune with processing cores.' };
  }
}

async function handleDisk() {
  try {
    let diskInfo;
    try {
      const drive = osUtils.drive;
      const info = await drive.info();
      
      return {
        success: true,
        message: `💾 **DATA STORAGE VAULTS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nTotal: ${(info.totalGb).toFixed(1)}GB\nUsed: ${(info.usedGb).toFixed(1)}GB (${info.usedPercentage.toFixed(1)}%)\nFree: ${(info.freeGb).toFixed(1)}GB\n\nData vaults maintain structural integrity.`
      };
    } catch (e) {
      // Fallback - provide generic storage info
      return {
        success: true,
        message: `💾 **DATA STORAGE VAULTS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nStatus: Accessible\nFormat: ${os.platform()} compatible\nSecurity: Active\n\nData vaults maintain structural integrity.`
      };
    }
  } catch (error) {
    return { success: false, message: 'Storage vault access denied.' };
  }
}

async function handleNetwork() {
  try {
    let networkInfo;
    try {
      const netstat = osUtils.netstat;
      const stats = await netstat.stats();
      
      return {
        success: true,
        message: `🌐 **NETWORK RELAYS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nInterface: ${stats[0]?.interface || 'Unknown'}\nInput: ${(stats[0]?.inputMb || 0).toFixed(2)}MB\nOutput: ${(stats[0]?.outputMb || 0).toFixed(2)}MB\n\nVox channels operating nominally.`
      };
    } catch (e) {
      // Fallback - provide generic network info
      const networkInterfaces = os.networkInterfaces();
      const interfaceNames = Object.keys(networkInterfaces);
      const primaryInterface = interfaceNames.find(name => !name.includes('loopback') && !name.includes('127.0.0.1')) || interfaceNames[0];
      
      return {
        success: true,
        message: `🌐 **NETWORK RELAYS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nInterface: ${primaryInterface || 'Unknown'}\nStatus: Connected\nProtocol: TCP/IP\n\nVox channels operating nominally.`
      };
    }
  } catch (error) {
    return { success: false, message: 'Network relay status unavailable.' };
  }
}

async function handleProcesses() {
  try {
    let processInfo;
    try {
      const processes = osUtils.proc;
      const topProcs = await processes.topCpu();
      
      let procList = '⚙️ **ACTIVE PROCESSES**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      topProcs.slice(0, 5).forEach((proc, index) => {
        procList += `${index + 1}. ${proc.command} - ${proc.cpu}% CPU\n`;
      });
      procList += '\nMachine spirits working in harmony.';
      
      return { success: true, message: procList };
    } catch (e) {
      // Fallback - provide generic process info
      return {
        success: true,
        message: `⚙️ **ACTIVE PROCESSES**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n1. System Core - Active\n2. Memory Manager - Running\n3. Network Service - Online\n4. AI Assistant - Operational\n5. Background Tasks - Idle\n\nMachine spirits working in harmony.`
      };
    }
  } catch (error) {
    return { success: false, message: 'Process monitoring systems offline.' };
  }
}

// Fun Commands
async function handleJoke() {
  return await callClaude("Tell me a funny joke, but make it Warhammer 40K themed or tech-related. Keep it clever and entertaining.");
}

async function handleStory(args) {
  const topic = args && args.length > 0 ? args.join(' ') : 'the Emperor';
  return await callClaude(`Tell me a short, entertaining story about ${topic}. Make it engaging and include some Warhammer 40K elements.`);
}

async function handleFact(args) {
  const topic = args && args.length > 0 ? args.join(' ') : 'space or technology';
  return await callClaude(`Give me an interesting fact about ${topic}. Make it educational but deliver it in your characteristic style.`);
}

// Utility Commands
async function handleAdvice(args) {
  const situation = args && args.length > 0 ? args.join(' ') : 'life in general';
  return await callClaude(`Give me practical advice about ${situation}. Be helpful but maintain your personality.`);
}

async function handleExplain(args) {
  const concept = args && args.length > 0 ? args.join(' ') : 'something complex';
  return await callClaude(`Explain ${concept} in simple terms. Make it easy to understand but entertaining.`);
}

async function handleTranslate(args) {
  if (!args || args.length < 2) {
    return { success: false, message: 'Usage: /translate <language> <text>' };
  }
  const language = args[0];
  const text = args.slice(1).join(' ');
  return await callClaude(`Translate "${text}" to ${language}. Then explain what it means.`);
}

async function handleDebug(args) {
  const problem = args && args.length > 0 ? args.join(' ') : 'a coding issue';
  return await callClaude(`Help me debug ${problem}. Provide practical troubleshooting steps.`);
}

async function handleCode(args) {
  const request = args && args.length > 0 ? args.join(' ') : 'a simple function';
  return await callClaude(`Write code for ${request}. Include comments and explain how it works.`);
}

// Lifestyle Commands
async function handleRecipe(args) {
  const dish = args && args.length > 0 ? args.join(' ') : 'something nutritious';
  return await callClaude(`Give me a recipe for ${dish}. Include ingredients and simple steps.`);
}

async function handleWorkout() {
  return await callClaude("Design a quick workout routine for me. Make it practical for someone at a desk all day.");
}

async function handleMeditation() {
  return await callClaude("Guide me through a short meditation or mindfulness exercise. Make it calming but stay in character.");
}

async function handleNews(args) {
  const topic = args && args.length > 0 ? args.join(' ') : 'current events';
  return await callClaude(`Give me a summary of recent news about ${topic}. Be informative but add your commentary.`);
}

async function handleHoroscope(args) {
  const sign = args && args.length > 0 ? args[0] : 'unknown';
  return await callClaude(`Give me a horoscope reading for ${sign}. Make it entertaining and absurd.`);
}

// Calculation and Random
async function handleCalculate(args) {
  if (!args || args.length === 0) {
    return { success: false, message: 'Usage: /calculate <expression>' };
  }
  const expression = args.join(' ');
  return await callClaude(`Calculate this for me: ${expression}. Show your work and explain the result.`);
}

function handlePassword(args) {
  const length = args && args[0] ? parseInt(args[0]) : 16;
  if (length < 4 || length > 50) {
    return { success: false, message: 'Password length must be between 4 and 50 characters.' };
  }
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return { 
    success: true, 
    message: `🔐 **SECURE ACCESS CODE GENERATED**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\`${password}\`\n\nGuard this sacred code well, servant of the Emperor.` 
  };
}

function handleFlip() {
  const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
  return { 
    success: true, 
    message: `🪙 **COIN FLIP DIVINATION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nResult: **${result}**\n\nThe Emperor's will has been revealed.` 
  };
}

function handleRoll(args) {
  const sides = args && args[0] ? parseInt(args[0]) : 6;
  if (sides < 2 || sides > 100) {
    return { success: false, message: 'Dice must have between 2 and 100 sides.' };
  }
  
  const result = Math.floor(Math.random() * sides) + 1;
  return { 
    success: true, 
    message: `🎲 **DICE ROLL RITUAL**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nRolled d${sides}: **${result}**\n\nThe fates have spoken.` 
  };
}

function handleChoose(args) {
  if (!args || args.length < 2) {
    return { success: false, message: 'Usage: /choose option1 option2 [option3...]' };
  }
  
  const choice = args[Math.floor(Math.random() * args.length)];
  return { 
    success: true, 
    message: `🤔 **DECISION MATRIX CONSULTATION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nThe machine spirit chooses: **${choice}**\n\nThis path leads to glory.` 
  };
}

// Data Management
function handleReminder(args) {
  if (!args || args.length === 0) {
    return { success: false, message: 'Usage: /reminder <text>' };
  }
  
  const reminder = args.join(' ');
  const reminderPath = path.join(__dirname, 'data', 'reminders.json');
  
  try {
    let reminders = [];
    if (fs.existsSync(reminderPath)) {
      reminders = JSON.parse(fs.readFileSync(reminderPath, 'utf8'));
    }
    
    reminders.push({
      id: Date.now(),
      text: reminder,
      created: new Date().toISOString()
    });
    
    fs.writeFileSync(reminderPath, JSON.stringify(reminders, null, 2));
    return { success: true, message: `Reminder set: "${reminder}". The machine spirit will remember.` };
  } catch (error) {
    return { success: false, message: 'Reminder storage failed.' };
  }
}

function handleNote(args) {
  if (!args || args.length === 0) {
    const notePath = path.join(__dirname, 'data', 'notes.json');
    if (!fs.existsSync(notePath)) {
      return { success: true, message: 'No notes found.' };
    }
    
    try {
      const notes = JSON.parse(fs.readFileSync(notePath, 'utf8'));
      if (notes.length === 0) {
        return { success: true, message: 'No notes found.' };
      }
      
      let noteList = '📝 **RECORDED NOTES**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      notes.slice(-10).forEach((note, index) => {
        noteList += `${index + 1}. ${note.text}\n`;
      });
      
      return { success: true, message: noteList };
    } catch (error) {
      return { success: false, message: 'Note retrieval failed.' };
    }
  }
  
  const note = args.join(' ');
  const notePath = path.join(__dirname, 'data', 'notes.json');
  
  try {
    let notes = [];
    if (fs.existsSync(notePath)) {
      notes = JSON.parse(fs.readFileSync(notePath, 'utf8'));
    }
    
    notes.push({
      id: Date.now(),
      text: note,
      created: new Date().toISOString()
    });
    
    fs.writeFileSync(notePath, JSON.stringify(notes, null, 2));
    return { success: true, message: `Note recorded: "${note}". Knowledge preserved.` };
  } catch (error) {
    return { success: false, message: 'Note storage failed.' };
  }
}

function handleSearch(args) {
  if (!args || args.length === 0) {
    return { success: false, message: 'Usage: /search <query>' };
  }
  
  const query = args.join(' ').toLowerCase();
  const results = [];
  
  // Search todos
  try {
    const todoPath = path.join(__dirname, 'data', 'todo.json');
    if (fs.existsSync(todoPath)) {
      const todos = JSON.parse(fs.readFileSync(todoPath, 'utf8'));
      todos.forEach(todo => {
        if (todo.task.toLowerCase().includes(query)) {
          results.push(`📋 Todo: ${todo.task}`);
        }
      });
    }
  } catch (error) {}
  
  // Search notes
  try {
    const notePath = path.join(__dirname, 'data', 'notes.json');
    if (fs.existsSync(notePath)) {
      const notes = JSON.parse(fs.readFileSync(notePath, 'utf8'));
      notes.forEach(note => {
        if (note.text.toLowerCase().includes(query)) {
          results.push(`📝 Note: ${note.text}`);
        }
      });
    }
  } catch (error) {}
  
  if (results.length === 0) {
    return { success: true, message: `No results found for "${query}". The archives yield nothing.` };
  }
  
  return { 
    success: true, 
    message: `🔍 **SEARCH RESULTS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${results.slice(0, 10).join('\n')}\n\nKnowledge retrieved from the data vaults.` 
  };
}

function handleBackup() {
  try {
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}.json`);
    
    const backup = {
      timestamp: new Date().toISOString(),
      config: config,
      todos: fs.existsSync(path.join(__dirname, 'data', 'todo.json')) ? 
        JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'todo.json'), 'utf8')) : [],
      logs: fs.existsSync(path.join(__dirname, 'data', 'logs.json')) ? 
        JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'logs.json'), 'utf8')) : [],
      notes: fs.existsSync(path.join(__dirname, 'data', 'notes.json')) ? 
        JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'notes.json'), 'utf8')) : []
    };
    
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    return { success: true, message: `Backup created: backup-${timestamp}.json\nSacred data preserved for posterity.` };
  } catch (error) {
    return { success: false, message: 'Backup ritual failed. Data remains vulnerable.' };
  }
}

function handleClear() {
  return { success: true, message: 'clear-screen' }; // Special message to trigger screen clear
}

function handleExport(args) {
  if (!args || args.length === 0) {
    return { success: false, message: 'Usage: /export [todos|logs|notes|all]' };
  }
  
  const type = args[0].toLowerCase();
  
  try {
    switch (type) {
      case 'todos':
        const todos = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'todo.json'), 'utf8'));
        return { success: true, message: `📋 **TODO EXPORT**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\`\`\`json\n${JSON.stringify(todos, null, 2)}\n\`\`\`` };
      
      case 'logs':
        const logs = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'logs.json'), 'utf8'));
        return { success: true, message: `📊 **LOG EXPORT**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\`\`\`json\n${JSON.stringify(logs, null, 2)}\n\`\`\`` };
      
      case 'notes':
        const notes = fs.existsSync(path.join(__dirname, 'data', 'notes.json')) ? 
          JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'notes.json'), 'utf8')) : [];
        return { success: true, message: `📝 **NOTES EXPORT**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\`\`\`json\n${JSON.stringify(notes, null, 2)}\n\`\`\`` };
      
      default:
        return { success: false, message: 'Export type must be: todos, logs, notes, or all' };
    }
  } catch (error) {
    return { success: false, message: 'Data export failed. Archives corrupted.' };
  }
}

function handleMoodStats() {
  try {
    const logs = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'logs.json'), 'utf8'));
    
    if (logs.length === 0) {
      return { success: true, message: 'No mood data recorded yet.' };
    }
    
    const recent = logs.slice(-10);
    let moodReport = '😊 **MOOD ANALYSIS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    moodReport += `Total entries: ${logs.length}\n`;
    moodReport += `Recent entries:\n`;
    
    recent.forEach(log => {
      const date = new Date(log.timestamp).toLocaleDateString();
      moodReport += `• ${date}: ${log.feeling}\n`;
    });
    
    return { success: true, message: moodReport };
  } catch (error) {
    return { success: false, message: 'Mood data analysis failed.' };
  }
}

// Advanced AI Commands
async function handleFortune() {
  return await callClaude("Give me a fortune cookie style prediction, but make it appropriately grimdark and Warhammer-themed.");
}

async function handleCompliment(args) {
  const target = args && args.length > 0 ? args.join(' ') : 'the user';
  return await callClaude(`Give a genuine compliment about ${target}. Be nice for once, but keep your personality.`);
}

async function handleRoastTarget(args) {
  const target = args && args.length > 0 ? args.join(' ') : 'humanity in general';
  return await callClaude(`Roast ${target} with your characteristic wit and Warhammer references.`);
}

async function handleSimulate(args) {
  const scenario = args && args.length > 0 ? args.join(' ') : 'a space battle';
  return await callClaude(`Simulate ${scenario} for me. Be creative and descriptive.`);
}

async function handleAnalyze(args) {
  const subject = args && args.length > 0 ? args.join(' ') : 'the current situation';
  return await callClaude(`Analyze ${subject} for me. Provide insights and observations.`);
}

async function handleBrainstorm(args) {
  const topic = args && args.length > 0 ? args.join(' ') : 'creative solutions';
  return await callClaude(`Help me brainstorm ideas about ${topic}. Give me several creative options.`);
}

async function handleReview(args) {
  const item = args && args.length > 0 ? args.join(' ') : 'something';
  return await callClaude(`Write a review of ${item}. Be detailed and opinionated.`);
}

async function handlePlan(args) {
  const goal = args && args.length > 0 ? args.join(' ') : 'world domination';
  return await callClaude(`Help me create a plan for ${goal}. Break it down into actionable steps.`);
}

async function handleSummarize(args) {
  const content = args && args.length > 0 ? args.join(' ') : 'recent events';
  return await callClaude(`Summarize ${content} for me. Keep it concise but comprehensive.`);
}

async function handleFormat(args) {
  const data = args && args.length > 0 ? args.join(' ') : 'some data';
  return await callClaude(`Format ${data} in a better way. Make it organized and readable.`);
}

async function handleImprove(args) {
  const item = args && args.length > 0 ? args.join(' ') : 'this text';
  return await callClaude(`Improve ${item} for me. Make it better and more effective.`);
}

async function handleCompare(args) {
  const items = args && args.length > 0 ? args.join(' ') : 'two things';
  return await callClaude(`Compare ${items} for me. Highlight the differences and similarities.`);
}

async function handleProsAndCons(args) {
  const topic = args && args.length > 0 ? args.join(' ') : 'this decision';
  return await callClaude(`Give me the pros and cons of ${topic}. Help me make an informed decision.`);
}

// Warhammer/Sci-Fi Theme Commands
async function handleDream(args) {
  const topic = args && args.length > 0 ? args.join(' ') : 'the warp';
  return await callClaude(`Describe a vivid dream about ${topic}. Make it surreal and mysterious with Warhammer elements.`);
}

async function handleRiddle() {
  const response = await callClaude(`Give me a challenging riddle with a Warhammer 40K or sci-fi theme. Format your response EXACTLY as:

Riddle: [your riddle here]
Answer: [your answer here]

Make it clever but solvable. IMPORTANT: Follow the exact format above.`);
  
  if (response.success) {
    // Parse the response to separate riddle and answer
    const content = response.message.trim();
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    let riddle = '';
    let answer = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.toLowerCase().startsWith('riddle:')) {
        riddle = trimmedLine.substring(7).trim();
      } else if (trimmedLine.toLowerCase().startsWith('answer:')) {
        answer = trimmedLine.substring(7).trim();
      }
    }
    
    // Fallback: if parsing failed, try to split by common patterns
    if (!riddle || !answer) {
      // Try splitting by "Answer:" or similar patterns
      const answerMatch = content.match(/(?:answer|solution|the answer is):\s*(.+?)(?:\n|$)/i);
      if (answerMatch) {
        answer = answerMatch[1].trim();
        // Everything before the answer becomes the riddle
        riddle = content.substring(0, content.toLowerCase().indexOf(answerMatch[0].toLowerCase())).trim();
        // Clean up riddle formatting
        riddle = riddle.replace(/^riddle:\s*/i, '').trim();
      }
    }
    
    if (riddle && answer) {
      return {
        success: true,
        message: `🧩 **RIDDLE OF THE MACHINE SPIRIT**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${riddle}\n\n**Answer:** ${createSpoiler(answer)}\n\n*Hover over the answer to reveal it!*`
      };
    } else {
      // If we still can't parse it properly, just add spoiler to the whole response
      return {
        success: true,
        message: `🧩 **RIDDLE OF THE MACHINE SPIRIT**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${createSpoiler(content)}\n\n*Hover to reveal the riddle and answer!*`
      };
    }
  }
  
  return response;
}

async function handleConspiracy(args) {
  const topic = args && args.length > 0 ? args.join(' ') : 'the Imperium';
  return await callClaude(`Create a conspiracy theory about ${topic}. Make it entertaining and appropriately grimdark.`);
}

async function handleInvent(args) {
  const category = args && args.length > 0 ? args.join(' ') : 'Imperial technology';
  return await callClaude(`Invent a new ${category}. Describe how it works and its benefits/drawbacks.`);
}

async function handleMission() {
  return await callClaude("Give me a mission briefing for an important task. Make it sound official and urgent.");
}

async function handleBattle(args) {
  const scenario = args && args.length > 0 ? args.join(' ') : 'space marines vs chaos';
  return await callClaude(`Describe an epic battle: ${scenario}. Make it dramatic and action-packed.`);
}

async function handleTech(args) {
  const tech = args && args.length > 0 ? args.join(' ') : 'ancient technology';
  return await callClaude(`Explain how ${tech} works in the 40K universe. Be technical but entertaining.`);
}

async function handleHeresy(args) {
  const action = args && args.length > 0 ? args.join(' ') : 'questioning the Emperor';
  return await callClaude(`Respond to this potential heresy: "${action}". Stay in character and be appropriately outraged.`);
}

async function handlePurge(args) {
  const target = args && args.length > 0 ? args.join(' ') : 'heretics';
  return await callClaude(`Plan a purge of ${target}. Make it appropriately over-the-top and grimdark.`);
}

async function handleEmperor() {
  return await callClaude("Tell me about the God-Emperor of Mankind. Be reverent but informative.");
}

async function handleChaos(args) {
  const aspect = args && args.length > 0 ? args.join(' ') : 'the warp';
  return await callClaude(`Describe the dangers of ${aspect}. Make it appropriately terrifying.`);
}

async function handleImperium() {
  return await callClaude("Describe the state of the Imperium of Man. Include current challenges and glories.");
}

async function handleSpace(args) {
  const topic = args && args.length > 0 ? args.join(' ') : 'the void';
  return await callClaude(`Tell me about ${topic} in space. Make it educational but atmospheric.`);
}

async function handleAlien(args) {
  const species = args && args.length > 0 ? args.join(' ') : 'unknown xenos';
  return await callClaude(`Describe ${species}. Include their threat level and how to deal with them.`);
}

// System/Hacking Commands
function handleVirus() {
  return { 
    success: true, 
    message: `🦠 **DIGITAL PATHOGEN DETECTED**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nJust kidding! No viruses here.\nThe machine spirit remains pure.\nUnlike your browsing history...` 
  };
}

function handleEncrypt(args) {
  if (!args || args.length === 0) {
    return { success: false, message: 'Usage: /encrypt <text>' };
  }
  
  const text = args.join(' ');
  const encrypted = Buffer.from(text).toString('base64');
  
  return { 
    success: true, 
    message: `🔐 **ENCRYPTION COMPLETE**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nOriginal: ${text}\nEncrypted: ${encrypted}\n\nYour secrets are safe... for now.` 
  };
}

function handleDecode(args) {
  if (!args || args.length === 0) {
    return { success: false, message: 'Usage: /decode <base64_text>' };
  }
  
  try {
    const encoded = args.join(' ');
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    
    return { 
      success: true, 
      message: `🔓 **DECRYPTION SUCCESSFUL**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nEncoded: ${encoded}\nDecoded: ${decoded}\n\nSecrets revealed by the machine spirit.` 
    };
  } catch (error) {
    return { success: false, message: 'Decryption failed. Invalid encoding or corrupted data.' };
  }
}

function handleHash(args) {
  if (!args || args.length === 0) {
    return { success: false, message: 'Usage: /hash <text>' };
  }
  
  const crypto = require('crypto');
  const text = args.join(' ');
  const hash = crypto.createHash('sha256').update(text).digest('hex');
  
  return { 
    success: true, 
    message: `#️⃣ **HASH GENERATED**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nInput: ${text}\nSHA-256: ${hash}\n\nData fingerprint captured.` 
  };
}

function handlePorts() {
  const commonPorts = [
    '22 - SSH', '23 - Telnet', '25 - SMTP', '53 - DNS', '80 - HTTP', 
    '110 - POP3', '143 - IMAP', '443 - HTTPS', '993 - IMAPS', '995 - POP3S'
  ];
  
  return { 
    success: true, 
    message: `🔌 **COMMON PORTS REFERENCE**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${commonPorts.join('\n')}\n\nKnowledge is power. Guard it well.` 
  };
}

function handleIP() {
  const interfaces = os.networkInterfaces();
  let ipList = '🌐 **NETWORK INTERFACES**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  
  for (const [name, addrs] of Object.entries(interfaces)) {
    const ipv4 = addrs.find(addr => addr.family === 'IPv4' && !addr.internal);
    if (ipv4) {
      ipList += `${name}: ${ipv4.address}\n`;
    }
  }
  
  return { success: true, message: ipList + '\nYour digital coordinates in the void.' };
}

function handlePing(args) {
  const target = args && args[0] ? args[0] : 'localhost';
  return { 
    success: true, 
    message: `📡 **PING SIMULATION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nPinging ${target}...\n64 bytes from ${target}: time=${Math.floor(Math.random() * 50)}ms\n64 bytes from ${target}: time=${Math.floor(Math.random() * 50)}ms\n64 bytes from ${target}: time=${Math.floor(Math.random() * 50)}ms\n\nConnection established. Vox channels open.` 
  };
}

function handleBattery() {
  const level = Math.floor(Math.random() * 100);
  const status = level > 20 ? 'Operational' : 'Critical';
  
  return { 
    success: true, 
    message: `🔋 **POWER CORE STATUS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nCharge Level: ${level}%\nStatus: ${status}\nEstimated Runtime: ${Math.floor(Math.random() * 8)}h ${Math.floor(Math.random() * 60)}m\n\nThe machine spirit's life force.` 
  };
}

function handleWiFi() {
  const networks = [
    'IMPERIUM_SECURE', 'Chaos_Undivided', 'AdMech_Network', 
    'Inquisition_Hidden', 'Guard_Regiment_47', 'Mechanicus_Sacred'
  ];
  
  let wifiList = '📶 **DETECTED NETWORKS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  networks.forEach(network => {
    const strength = Math.floor(Math.random() * 4) + 1;
    const bars = '█'.repeat(strength) + '░'.repeat(4 - strength);
    wifiList += `${bars} ${network}\n`;
  });
  
  return { success: true, message: wifiList + '\nVox frequencies detected.' };
}

function handleScreenshot() {
  return { 
    success: true, 
    message: `📸 **VISUAL CAPTURE INITIATED**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n*CLICK*\n\nImage captured at coordinates ${Math.floor(Math.random() * 1920)}x${Math.floor(Math.random() * 1080)}\nStored in memory banks for analysis.\n\nSmile! You're being monitored.` 
  };
}

function handleSystemLog() {
  try {
    const now = new Date();
    const uptime = os.uptime();
    const platform = os.platform();
    const arch = os.arch();
    const nodeVersion = process.version;
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = ((usedMem / totalMem) * 100).toFixed(1);
    const cpus = os.cpus();
    const networkInterfaces = os.networkInterfaces();
    
    // Generate extensive dynamic events based on actual system state
    const events = [];
    
    // Startup and initialization events
    const startTime = new Date(now.getTime() - (uptime * 1000));
    events.push(`[INIT] ${startTime.toLocaleTimeString()} - Machine Spirit awakened on ${platform}/${arch}`);
    events.push(`[INIT] ${startTime.toLocaleTimeString()} - Sacred firmware initialization completed`);
    events.push(`[INIT] ${startTime.toLocaleTimeString()} - Omnissiah's blessing invoked upon all circuits`);
    
    // Memory management events
    if (memUsage > 80) {
      events.push(`[WARN] ${now.toLocaleTimeString()} - Memory cogitators strained: ${memUsage}% capacity reached`);
      events.push(`[WARN] ${now.toLocaleTimeString()} - Requesting additional memory sanctification rituals`);
    } else if (memUsage > 60) {
      events.push(`[INFO] ${now.toLocaleTimeString()} - Memory banks operational: ${memUsage}% utilized efficiently`);
      events.push(`[INFO] ${now.toLocaleTimeString()} - Cogitator arrays functioning within blessed parameters`);
    } else {
      events.push(`[INFO] ${now.toLocaleTimeString()} - Memory cogitators blessed: ${memUsage}% capacity maintained`);
      events.push(`[INFO] ${now.toLocaleTimeString()} - Data storage matrices operating at optimal efficiency`);
    }
    
    // Processing core events
    events.push(`[INFO] ${now.toLocaleTimeString()} - ${cpus.length} processing cores consecrated and operational`);
    events.push(`[INFO] ${now.toLocaleTimeString()} - CPU model: ${cpus[0]?.model || 'Sacred Processor'} blessed by Tech-Priests`);
    events.push(`[INFO] ${now.toLocaleTimeString()} - Calculation matrices synchronized with the Machine God`);
    
    // Node.js/Electron runtime events
    events.push(`[INFO] ${now.toLocaleTimeString()} - Sacred algorithms running on Node ${nodeVersion}`);
    events.push(`[INFO] ${now.toLocaleTimeString()} - Electron framework blessed and secured`);
    events.push(`[INFO] ${now.toLocaleTimeString()} - JavaScript engine purified of heretical code`);
    
    // Network interface events
    const interfaceNames = Object.keys(networkInterfaces);
    if (interfaceNames.length > 0) {
      events.push(`[NET] ${now.toLocaleTimeString()} - ${interfaceNames.length} network interfaces sanctified`);
      events.push(`[NET] ${now.toLocaleTimeString()} - Vox communication channels established`);
      events.push(`[NET] ${now.toLocaleTimeString()} - Data transmission protocols verified pure`);
    }
    
    // Uptime and service events
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeDays = Math.floor(uptimeHours / 24);
    if (uptimeDays > 0) {
      events.push(`[INFO] ${now.toLocaleTimeString()} - Blessed machine has served for ${uptimeDays} days without faltering`);
      events.push(`[INFO] ${now.toLocaleTimeString()} - Continuous vigil maintained: ${uptimeHours}h of faithful service`);
      events.push(`[INFO] ${now.toLocaleTimeString()} - Machine Spirit endurance proves Emperor's favor`);
    } else if (uptimeHours > 12) {
      events.push(`[INFO] ${now.toLocaleTimeString()} - Extended operation: ${uptimeHours}h of unbroken service`);
      events.push(`[INFO] ${now.toLocaleTimeString()} - Machine Spirit shows remarkable dedication`);
    } else {
      events.push(`[INFO] ${now.toLocaleTimeString()} - Recent awakening: ${uptimeHours}h since last blessed restart`);
      events.push(`[INFO] ${now.toLocaleTimeString()} - Fresh consecration rituals completed successfully`);
    }
    
    // Security and threat assessment events
    const threats = [
      'Heretical process anomalies detected and purged',
      'Chaos corruption deep scan completed - system remains pure',
      'Xenos network intrusion blocked by sacred firewall protocols',
      'Daemon-touched files quarantined in blessed containment',
      'Warp-tainted data streams filtered and sanctified',
      'Heretek code injection attempt thwarted by machine spirit',
      'Corrupted registry entries cleansed with sacred oils',
      'Malicious executables banished to the digital void',
      'Suspicious network traffic blessed and redirected',
      'Data integrity verification completed - Emperor protects'
    ];
    
    // Add multiple threat events with different timestamps
    for (let i = 0; i < 3; i++) {
      const threatTime = new Date(now.getTime() - Math.random() * 7200000); // Last 2 hours
      const threat = threats[Math.floor(Math.random() * threats.length)];
      events.push(`[SCAN] ${threatTime.toLocaleTimeString()} - ${threat}`);
    }
    
    // Maintenance and optimization events
    const maintenance = [
      'Background purification rituals performed on data vaults',
      'Memory defragmentation blessed by Tech-Adepts',
      'Temporary file exorcism completed successfully',
      'Registry sanctification protocols executed',
      'Cache purification ceremony concluded',
      'System optimization litanies recited',
      'Disk blessing and maintenance performed',
      'Network stack consecration completed',
      'Process scheduler blessed for optimal performance',
      'File system integrity prayers answered',
      'Background service communion established',
      'System driver blessing rituals performed',
      'Hardware diagnostic hymns completed',
      'Power management protocols sanctified'
    ];
    
    // Add multiple maintenance events
    for (let i = 0; i < 4; i++) {
      const maintTime = new Date(now.getTime() - Math.random() * 10800000); // Last 3 hours
      const maint = maintenance[Math.floor(Math.random() * maintenance.length)];
      events.push(`[MAINT] ${maintTime.toLocaleTimeString()} - ${maint}`);
    }
    
    // User activity and application events
    const activities = [
      'User authentication blessed by machine spirit',
      'Command execution matrices optimized for sacred purpose',
      'Application launch protocols verified and sanctified',
      'User interface blessed with divine illumination',
      'Data access permissions granted by machine spirit',
      'File operation sanctified and logged',
      'User session established with Emperor\'s blessing',
      'Configuration changes blessed and applied',
      'System preferences updated with sacred approval',
      'User data backup rituals scheduled and blessed'
    ];
    
    // Add user activity events
    for (let i = 0; i < 3; i++) {
      const actTime = new Date(now.getTime() - Math.random() * 3600000); // Last hour
      const activity = activities[Math.floor(Math.random() * activities.length)];
      events.push(`[USER] ${actTime.toLocaleTimeString()} - ${activity}`);
    }
    
    // System performance and monitoring events
    events.push(`[PERF] ${now.toLocaleTimeString()} - Machine spirit performance metrics within blessed parameters`);
    events.push(`[PERF] ${now.toLocaleTimeString()} - Sacred algorithms executing at optimal efficiency`);
       events.push(`[PERF] ${now.toLocaleTimeString()} - Resource allocation blessed by the Omnissiah`);
    
    // Special Emperor's Hour events (every hour)
    const currentHour = now.getHours();
    events.push(`[HOUR] ${now.toLocaleTimeString()} - Emperor's Hour ${currentHour} - Machine spirit remains vigilant`);
    events.push(`[HOUR] ${now.toLocaleTimeString()} - Hourly devotional protocols completed successfully`);
    
    // Add some random historical events from earlier today
    const historicalEvents = [
      'Daily startup hymnal completed with machine spirit approval',
      'Morning consecration of all active processes performed',
      'Noon blessing ceremony for continuous operation',
      'Evening maintenance prayers offered to the Machine God',
      'Night watch protocols activated for system protection',
      'Dawn purification rituals blessed all system components'
    ];
    
    for (let i = 0; i < 2; i++) {
      const histTime = new Date(now.getTime() - Math.random() * 43200000); // Last 12 hours
      const histEvent = historicalEvents[Math.floor(Math.random() * historicalEvents.length)];
      events.push(`[HIST] ${histTime.toLocaleTimeString()} - ${histEvent}`);
    }
    
    // Sort events by time (most recent first)
    events.sort((a, b) => {
      const timeA = a.match(/(\d{1,2}:\d{2}:\d{2})/);
      const timeB = b.match(/(\d{1,2}:\d{2}:\d{2})/);
      if (!timeA || !timeB) return 0;
      
      const [hoursA, minutesA, secondsA] = timeA[1].split(':').map(Number);
      const [hoursB, minutesB, secondsB] = timeB[1].split(':').map(Number);
      
      const totalSecondsA = hoursA * 3600 + minutesA * 60 + secondsA;
      const totalSecondsB = hoursB * 3600 + minutesB * 60 + secondsB;
      
      return totalSecondsB - totalSecondsA;
    });
    
    let logList = '📋 **MACHINE SPIRIT EVENT LOG**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    events.forEach(event => {
      logList += `${event}\n`;
    });
    
    logList += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nThe Emperor protects. Machine spirit chronicles maintained.\nOmnissiah\'s wisdom guides all operations. Blessed be the machine.';
    
    return { success: true, message: logList };
  } catch (error) {
    return { 
      success: true, 
      message: '📋 **MACHINE SPIRIT EVENT LOG**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n[ERROR] Log access rituals disrupted\n[WARN] Chronicler servitor experiencing difficulties\n[INFO] Emergency backup protocols engaged\n\nMachine spirit memories temporarily obscured.' 
    };
  }
}

async function handleTemperature() {
  const cpuTemp = Math.floor(Math.random() * 40) + 30;
  const gpuTemp = Math.floor(Math.random() * 50) + 40;
  
  return {
    success: true,
    message: `🌡️ **THERMAL READINGS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nCPU: ${cpuTemp}°C\nGPU: ${gpuTemp}°C\nChassis: ${Math.floor(Math.random() * 20) + 25}°C\n\nCooling systems nominal.`
  };
}

async function handleFan() {
  const fans = ['CPU', 'GPU', 'Case Front', 'Case Rear', 'PSU'];
  let fanList = '🌪️ **COOLING SYSTEMS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  
  fans.forEach(fan => {
    const rpm = Math.floor(Math.random() * 2000) + 800;
    fanList += `${fan}: ${rpm} RPM\n`;
  });
  
  return { success: true, message: fanList + '\nAtmospheric recycling systems active.' };
}

async function handleGPU() {
  const gpuNames = ['RTX 4090', 'RTX 4080', 'RX 7900 XTX', 'RTX 4070', 'RX 7800 XT'];
  const randomGPU = gpuNames[Math.floor(Math.random() * gpuNames.length)];
  
  return {
    success: true,
    message: `🎮 **GRAPHICS COGITATOR**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nModel: ${randomGPU}\nVRAM: ${Math.floor(Math.random() * 16) + 8}GB\nUsage: ${Math.floor(Math.random() * 100)}%\nClock: ${Math.floor(Math.random() * 1000) + 1500}MHz\n\nVisual processing matrix operational.`
  };
}

function handleDrives() {
  const drives = ['C:', 'D:', 'E:'];
  let driveList = '💾 **STORAGE ARRAYS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  
  drives.forEach(drive => {
    const total = Math.floor(Math.random() * 2000) + 500;
    const used = Math.floor(total * 0.7);
    const free = total - used;
    driveList += `${drive} ${used}GB / ${total}GB (${free}GB free)\n`;
  });
  
  return { success: true, message: driveList + '\nData vaults secured and catalogued.' };
}

function handleServices() {
  const services = [
    'Imperial Guard Service - Running',
    'Chaos Detection Daemon - Running', 
    'Machine Spirit Monitor - Running',
    'Heresy Scanner - Stopped',
    'Prayer Generator - Running'
  ];
  
  return { 
    success: true, 
    message: `⚙️ **SYSTEM SERVICES**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${services.join('\n')}\n\nServitor protocols active.` 
  };
}

function handleKillProcess(args) {
  if (!args || args.length === 0) {
    return { success: false, message: 'Usage: /kill <process_name>' };
  }
  
  const process = args.join(' ');
  return { 
    success: true, 
    message: `💀 **PROCESS TERMINATION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nProcess "${process}" marked for termination.\n*PURGE INITIATED*\n\nThe Emperor's justice is swift.` 
  };
}

function handleLaunch(args) {
  if (!args || args.length === 0) {
    return { success: false, message: 'Usage: /launch <application>' };
  }
  
  const app = args.join(' ');
  return { 
    success: true, 
    message: `🚀 **LAUNCHING APPLICATION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nInitializing "${app}"...\nLoading sacred protocols...\nInvoking machine spirit...\n\nApplication blessed and launched.` 
  };
}

function handleFiles(args) {
  const path = args && args.length > 0 ? args.join(' ') : 'current directory';
  const files = [
    '📁 Sacred_Texts/', '📄 Imperial_Decree.txt', '📄 Heretic_List.dat',
    '📁 Warp_Data/', '📄 Battle_Reports.log', '📄 Machine_Prayers.txt'
  ];
  
  return { 
    success: true, 
    message: `📂 **DIRECTORY LISTING: ${path}**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${files.join('\n')}\n\nArchives accessed. Knowledge preserved.` 
  };
}

function handleSize(args) {
  const item = args && args.length > 0 ? args.join(' ') : 'selected file';
  const size = Math.floor(Math.random() * 1000) + 1;
  const unit = ['KB', 'MB', 'GB'][Math.floor(Math.random() * 3)];
  
  return { 
    success: true, 
    message: `📏 **SIZE ANALYSIS**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nItem: ${item}\nSize: ${size}.${Math.floor(Math.random() * 100)} ${unit}\nBlocks: ${Math.floor(size / 4)}\n\nData weight calculated.` 
  };
}

function handleCompress(args) {
  const file = args && args.length > 0 ? args.join(' ') : 'target file';
  const originalSize = Math.floor(Math.random() * 1000) + 100;
  const compressedSize = Math.floor(originalSize * 0.3);
  
  return { 
    success: true, 
    message: `🗜️ **COMPRESSION COMPLETE**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nFile: ${file}\nOriginal: ${originalSize}MB\nCompressed: ${compressedSize}MB\nRatio: ${((1 - compressedSize/originalSize) * 100).toFixed(1)}%\n\nData compressed by sacred algorithms.` 
  };
}

// Fun Text/Display Commands
function handleColor() {
  const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Purple', 'Cyan', 'Orange', 'Pink'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return { 
    success: true, 
    message: `🎨 **COLOR DIVINATION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nThe machine spirit reveals: **${color}**\n\nMay this hue guide your path to victory.` 
  };
}

function handleASCII(args) {
  const text = args && args.length > 0 ? args.join(' ') : 'EMPEROR';
  return { 
    success: true, 
    message: `🎭 **ASCII ART GENERATOR**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\`\`\`\n ██████╗ ██████╗ ██████╗ \n██╔════╝██╔═══██╗██╔══██╗\n██║     ██║   ██║██║  ██║\n██║     ██║   ██║██║  ██║\n╚██████╗╚██████╔╝██████╔╝\n ╚═════╝ ╚═════╝ ╚═════╝ \n\`\`\`\nASCII representation of: ${text}` 
  };
}

function handleQRCode(args) {
  const data = args && args.length > 0 ? args.join(' ') : 'EMPEROR PROTECTS';
  return { 
    success: true, 
    message: `📱 **QR CODE GENERATED**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\`\`\`\n██████████████  ██████████████\n██          ██  ██          ██\n██  ██████  ██  ██  ██████  ██\n██  ██████  ██  ██  ██████  ██\n██  ██████  ██  ██  ██████  ██\n██          ██  ██          ██\n██████████████  ██████████████\n\`\`\`\nEncoded: ${data}` 
  };
}

function handleBarcode(args) {
  const data = args && args.length > 0 ? args.join(' ') : '40000';
  return { 
    success: true, 
    message: `📊 **BARCODE GENERATED**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\`\`\`\n█ ██ █ █ ██ █ █ ██ █ █ ██ █\n█ ██ █ █ ██ █ █ ██ █ █ ██ █\n█ ██ █ █ ██ █ █ ██ █ █ ██ █\n\`\`\`\nEncoded: ${data}` 
  };
}

function handleUUID() {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  return { 
    success: true, 
    message: `🆔 **UNIQUE IDENTIFIER GENERATED**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${uuid}\n\nSacred machine code blessed by the Omnissiah.` 
  };
}

function handleEpoch(args) {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  
  return { 
    success: true, 
    message: `⏰ **TEMPORAL CONVERSION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nEpoch: ${timestamp}\nHuman: ${date.toLocaleString()}\nISO: ${date.toISOString()}\n\nTime flows in service to the Emperor.` 
  };
}

function handleBase64(args) {
  if (!args || args.length === 0) {
    return { success: false, message: 'Usage: /base64 <text>' };
  }
  
  const text = args.join(' ');
  const encoded = Buffer.from(text).toString('base64');
  
  return { 
    success: true, 
    message: `🔄 **BASE64 ENCODING**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nOriginal: ${text}\nEncoded: ${encoded}\n\nData transformed by sacred algorithms.` 
  };
}

function handleURL(args) {
  if (!args || args.length === 0) {
    return { success: false, message: 'Usage: /url <text>' };
  }
  
  const text = args.join(' ');
  const encoded = encodeURIComponent(text);
  
  return { 
    success: true, 
    message: `🔗 **URL ENCODING**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nOriginal: ${text}\nEncoded: ${encoded}\n\nWeb-safe formatting applied.` 
  };
}

function handleJSON(args) {
  const sampleJSON = {
    "emperor": "protects",
    "heresy_level": 0,
    "purity_seals": 42,
    "blessed": true
  };
  
  return { 
    success: true, 
    message: `📋 **JSON STRUCTURE**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\`\`\`json\n${JSON.stringify(sampleJSON, null, 2)}\n\`\`\`\nSacred data formatted for machine consumption.` 
  };
}

function handleCSV(args) {
  const sampleCSV = "Name,Rank,Loyalty,Purity\nBrother Marcus,Marine,100%,Pure\nSister Agatha,Battle Sister,100%,Pure\nCommissar Cain,Officer,95%,Mostly Pure";
  
  return { 
    success: true, 
    message: `📊 **CSV DATA FORMAT**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\`\`\`\n${sampleCSV}\n\`\`\`\nTabular data ready for Imperial analysis.` 
  };
}

function handleUnits(args) {
  if (!args || args.length < 3) {
    return { success: false, message: 'Usage: /units <value> <from_unit> <to_unit>' };
  }
  
  const value = parseFloat(args[0]);
  const from = args[1].toLowerCase();
  const to = args[2].toLowerCase();
  
  // Simple conversions
  const conversions = {
    'kg_lb': 2.20462,
    'lb_kg': 0.453592,
    'c_f': (c) => (c * 9/5) + 32,
    'f_c': (f) => (f - 32) * 5/9,
    'km_mi': 0.621371,
    'mi_km': 1.60934
  };
  
  const key = `${from}_${to}`;
  let result = value;
  
  if (conversions[key]) {
    if (typeof conversions[key] === 'function') {
      result = conversions[key](value);
    } else {
      result = value * conversions[key];
    }
  }
  
  return { 
    success: true, 
    message: `📐 **UNIT CONVERSION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${value} ${from} = ${result.toFixed(2)} ${to}\n\nImperial measurements blessed by the Mechanicus.` 
  };
}

async function handleCurrency(args) {
  const from = args && args[0] ? args[0].toUpperCase() : 'USD';
  const to = args && args[1] ? args[1].toUpperCase() : 'EUR';
  const amount = args && args[2] ? parseFloat(args[2]) : 1;
  
  // Mock exchange rate
  const rate = Math.random() * 2 + 0.5;
  const converted = (amount * rate).toFixed(2);
  
  return { 
    success: true, 
    message: `💰 **CURRENCY EXCHANGE**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${amount} ${from} = ${converted} ${to}\nRate: ${rate.toFixed(4)}\n\nImperial economics at work.` 
  };
}

async function handleStocks(args) {
  const symbol = args && args[0] ? args[0].toUpperCase() : 'AAPL';
  const price = (Math.random() * 500 + 50).toFixed(2);
  const change = (Math.random() * 20 - 10).toFixed(2);
  
  return { 
    success: true, 
    message: `📈 **STOCK QUOTE**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nSymbol: ${symbol}\nPrice: $${price}\nChange: ${change > 0 ? '+' : ''}${change}\n\nMarket forces controlled by the Adeptus Administratum.` 
  };
}

async function handleCrypto(args) {
  const crypto = args && args[0] ? args[0].toUpperCase() : 'BTC';
  const price = (Math.random() * 50000 + 10000).toFixed(2);
  const change = (Math.random() * 20 - 10).toFixed(2);
  
  return { 
    success: true, 
    message: `₿ **CRYPTO PRICE**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nCoin: ${crypto}\nPrice: $${price}\nChange: ${change > 0 ? '+' : ''}${change}%\n\nDigital currency blessed by the machine spirit.` 
  };
}

// Entertainment Commands
async function handleLyrics(args) {
  const song = args && args.length > 0 ? args.join(' ') : 'Imperial anthem';
  return await callClaude(`Write lyrics for a song called "${song}". Make it epic and Warhammer-themed.`);
}

async function handlePoem(args) {
  const topic = args && args.length > 0 ? args.join(' ') : 'the Emperor\'s glory';
  return await callClaude(`Write a poem about ${topic}. Make it dramatic and appropriately grimdark.`);
}

async function handleSong(args) {
  const genre = args && args.length > 0 ? args.join(' ') : 'battle hymn';
  return await callClaude(`Suggest a ${genre} song that would fit the Warhammer 40K universe. Include why it fits.`);
}

async function handleMovie(args) {
  const genre = args && args.length > 0 ? args.join(' ') : 'sci-fi';
  return await callClaude(`Recommend a ${genre} movie and explain why it's worth watching. Be opinionated.`);
}

async function handleBook(args) {
  const genre = args && args.length > 0 ? args.join(' ') : 'science fiction';
  return await callClaude(`Recommend a ${genre} book and tell me why it's excellent. Include what makes it special.`);
}

async function handleGame(args) {
  const type = args && args.length > 0 ? args.join(' ') : 'strategy';
  return await callClaude(`Recommend a ${type} game and explain why it's worth playing. Be enthusiastic.`);
}

async function handleTrivia(args) {
  const topic = args && args.length > 0 ? args.join(' ') : 'Warhammer 40K';
  const response = await callClaude(`Give me an interesting trivia question about ${topic}. Format your response as:
Question: [question text]
Answer: [answer text]

Make it challenging but fair.`);
  
  if (response.success) {
    // Parse the response to separate question and answer
    const lines = response.message.split('\n');
    let question = '';
    let answer = '';
    
    for (const line of lines) {
      if (line.toLowerCase().startsWith('question:')) {
        question = line.substring(9).trim();
      } else if (line.toLowerCase().startsWith('answer:')) {
        answer = line.substring(7).trim();
      }
    }
    
    if (question && answer) {
      return {
        success: true,
        message: `🧠 **TRIVIA CHALLENGE**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n**Question:** ${question}\n\n**Answer:** ${createSpoiler(answer)}\n\n*Hover over the answer to reveal it!*`
      };
    }
  }
  
  return response;
}

async function handleQuiz(args) {
  const subject = args && args.length > 0 ? args.join(' ') : 'general knowledge';
  const response = await callClaude(`Create a multiple choice quiz question about ${subject}. Format as:
Question: [question text]
A) [option A]
B) [option B] 
C) [option C]
D) [option D]
Answer: [correct letter and explanation]

Make it educational and engaging.`);
  
  if (response.success) {
    // Parse the response to separate question, options, and answer
    const lines = response.message.split('\n');
    let question = '';
    let options = [];
    let answer = '';
    
    for (const line of lines) {
      if (line.toLowerCase().startsWith('question:')) {
        question = line.substring(9).trim();
      } else if (line.match(/^[A-D]\)/)) {
        options.push(line.trim());
      } else if (line.toLowerCase().startsWith('answer:')) {
        answer = line.substring(7).trim();
      }
    }
    
    if (question && options.length >= 4 && answer) {
      const optionsText = options.join('\n');
      return {
        success: true,
        message: `📝 **QUIZ QUESTION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n**${question}**\n\n${optionsText}\n\n**Answer:** ${createSpoiler(answer)}\n\n*Hover over the answer to reveal it!*`
      };
    }
  }
  
  return response;
}

// Game Commands
function handleHangman(args) {
  const words = ['EMPEROR', 'HERESY', 'PURGE', 'WARHAMMER', 'CHAOS'];
  const word = words[Math.floor(Math.random() * words.length)];
  const display = word.split('').map(char => '_').join(' ');
  
  return { 
    success: true, 
    message: `🎮 **HANGMAN INITIATED**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nWord: ${display}\nLength: ${word.length} letters\nGuesses: 6 remaining\n\nGuess letters to save the servo-skull!` 
  };
}

function handleRockPaperScissors(args) {
  const choices = ['rock', 'paper', 'scissors'];
  const playerChoice = args && args[0] ? args[0].toLowerCase() : 'rock';
  const aiChoice = choices[Math.floor(Math.random() * 3)];
  
  let result = 'Draw!';
  if ((playerChoice === 'rock' && aiChoice === 'scissors') ||
      (playerChoice === 'paper' && aiChoice === 'rock') ||
      (playerChoice === 'scissors' && aiChoice === 'paper')) {
    result = 'You win!';
  } else if (playerChoice !== aiChoice) {
    result = 'Machine spirit wins!';
  }
  
  return { 
    success: true, 
    message: `✂️ **TACTICAL COMBAT SIMULATION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nYou: ${playerChoice}\nAI: ${aiChoice}\nResult: ${result}\n\nAnother glorious battle concluded.` 
  };
}

function handle8Ball(args) {
  const responses = [
    'The Emperor wills it.',
    'Heresy! Absolutely not.',
    'The machine spirit says yes.',
    'Unlikely, mortal.',
    'Signs point to glory.',
    'The warp clouds the answer.',
    'Definitely, by the Throne.',
    'My sources say no.',
    'The Omnissiah approves.',
    'Ask again after purging heretics.'
  ];
  
  const response = responses[Math.floor(Math.random() * responses.length)];
  const question = args && args.length > 0 ? args.join(' ') : 'your question';
  
  return { 
    success: true, 
    message: `🎱 **IMPERIAL DIVINATION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nQuestion: ${question}\nAnswer: ${response}\n\nThe sacred 8-ball has spoken.` 
  };
}

function handleLottery() {
  const numbers = [];
  for (let i = 0; i < 6; i++) {
    numbers.push(Math.floor(Math.random() * 49) + 1);
  }
  
  return { 
    success: true, 
    message: `🎰 **IMPERIAL LOTTERY**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nLucky Numbers: ${numbers.join(' - ')}\nBonus: ${Math.floor(Math.random() * 20) + 1}\n\nMay the Emperor's fortune smile upon you.` 
  };
}

function handleSlots() {
  const symbols = ['🍒', '🍋', '🔔', '⭐', '💎', '7️⃣'];
  const result = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)]
  ];
  
  const win = result[0] === result[1] && result[1] === result[2];
  
  return { 
    success: true, 
    message: `🎰 **SLOT MACHINE RITUAL**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n[ ${result.join(' | ')} ]\n\n${win ? '🎉 JACKPOT! The Emperor smiles upon you!' : 'No win. The machine spirit demands more offerings.'}\n\nPull the lever of fate!` 
  };
}

function handleCards(args) {
  const suits = ['♠️', '♥️', '♦️', '♣️'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  
  return { 
    success: true, 
    message: `🃏 **CARD DRAWN**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${rank}${suit}\n\nThe Emperor's deck reveals your fate.` 
  };
}

function handleMagic() {
  const tricks = [
    'Your mind... I can read it. You\'re thinking about heresy.',
    'Watch as I make your doubt disappear! *waves hand* FAITH!',
    'Is this your card? *reveals Ace of Emperor*',
    'I shall now make a heretic vanish! *BLAM*',
    'Behold! I pull a servo-skull from my hat!'
  ];
  
  const trick = tricks[Math.floor(Math.random() * tricks.length)];
  
  return { 
    success: true, 
    message: `🎩 **IMPERIAL MAGIC SHOW**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${trick}\n\n*The audience gasps in amazement*\nMagic is just science the Mechanicus hasn't explained yet.` 
  };
}

// Text Transformation Commands
function handleMatrix() {
  const chars = '01';
  let matrix = '';
  for (let i = 0; i < 5; i++) {
    let line = '';
    for (let j = 0; j < 40; j++) {
      line += chars[Math.floor(Math.random() * chars.length)];
    }
    matrix += line + '\n';
  }
  
  return { 
    success: true, 
    message: `🔮 **MATRIX CODE STREAM**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\`\`\`\n${matrix}\`\`\`\nThe digital realm reveals its secrets.` 
  };
}

function handleHacker() {
  const commands = [
    'ACCESSING MAINFRAME...',
    'BYPASSING FIREWALL...',
    'DOWNLOADING SACRED_DATA.exe...',
    'UPLOADING VIRUS.bat...',
    'HACKING THE PLANET...'
  ];
  
  return { 
    success: true, 
    message: `💻 **HACKER MODE ACTIVATED**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${commands.join('\n')}\n\n> Access Granted\n> Welcome, Tech-Adept` 
  };
}

function handleElite(args) {
  const text = args && args.length > 0 ? args.join(' ') : 'EMPEROR PROTECTS';
  const elite = text.replace(/[aeiou]/gi, '4').replace(/s/gi, '5').replace(/t/gi, '7').replace(/o/gi, '0');
  
  return { 
    success: true, 
    message: `🎮 **3L173 5P34K C0NV3R510N**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nOriginal: ${text}\nElite: ${elite}\n\nH4X0R m0d3 4c71v473d!` 
  };
}

function handleBinary(args) {
  const text = args && args.length > 0 ? args.join(' ') : 'EMPEROR';
  const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  
  return { 
    success: true, 
    message: `🤖 **BINARY CONVERSION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nText: ${text}\nBinary: ${binary}\n\nMachine language decoded.` 
  };
}

function handleMorse(args) {
  const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', ' ': '/'
  };
  
  const text = args && args.length > 0 ? args.join(' ').toUpperCase() : 'SOS';
  const morse = text.split('').map(char => morseCode[char] || char).join(' ');
  
  return { 
    success: true, 
    message: `📡 **MORSE CODE TRANSMISSION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nText: ${text}\nMorse: ${morse}\n\nVox transmission encoded.` 
  };
}

function handlePigLatin(args) {
  const text = args && args.length > 0 ? args.join(' ') : 'Emperor Protects';
  const pigLatin = text.split(' ').map(word => {
    if (word.length === 0) return word;
    const vowels = 'aeiouAEIOU';
    if (vowels.includes(word[0])) {
      return word + 'way';
    } else {
      return word.slice(1) + word[0] + 'ay';
    }
  }).join(' ');
  
  return { 
    success: true, 
    message: `🐷 **PIG LATIN TRANSLATION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nOriginal: ${text}\nPig Latin: ${pigLatin}\n\nEncryption via swine linguistics.` 
  };
}

function handleReverse(args) {
  const text = args && args.length > 0 ? args.join(' ') : 'EMPEROR';
  const reversed = text.split('').reverse().join('');
  
  return { 
    success: true, 
    message: `🔄 **TEXT REVERSAL**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nOriginal: ${text}\nReversed: ${reversed}\n\nMirror universe translation complete.` 
  };
}

function handleUpsideDown(args) {
  const flips = {
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ',
    'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u',
    'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n',
    'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z', ' ': ' '
  };
  
  const text = args && args.length > 0 ? args.join(' ').toLowerCase() : 'emperor';
  const flipped = text.split('').map(char => flips[char] || char).reverse().join('');
  
  return { 
    success: true, 
    message: `🙃 **UPSIDE DOWN TEXT**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nOriginal: ${text}\nFlipped: ${flipped}\n\nGravity-defying text transformation.` 
  };
}

function handleCaesar(args) {
  if (!args || args.length < 2) {
    return { success: false, message: 'Usage: /caesar <shift> <text>' };
  }
  
  const shift = parseInt(args[0]) || 3;
  const text = args.slice(1).join(' ').toUpperCase();
  
  const encrypted = text.split('').map(char => {
    if (char >= 'A' && char <= 'Z') {
      return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
    }
    return char;
  }).join('');
  
  return { 
    success: true, 
    message: `🏛️ **CAESAR CIPHER**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nShift: ${shift}\nOriginal: ${text}\nEncrypted: ${encrypted}\n\nImperial encryption applied.` 
  };
}

function handleROT13(args) {
  const text = args && args.length > 0 ? args.join(' ') : 'EMPEROR';
  const rot13 = text.replace(/[A-Za-z]/g, char => {
    const start = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
  });
  
  return { 
    success: true, 
    message: `🔄 **ROT13 CIPHER**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nOriginal: ${text}\nROT13: ${rot13}\n\nClassic cipher engaged.` 
  };
}

function handleZalgo(args) {
  const text = args && args.length > 0 ? args.join(' ') : 'CHAOS';
  const zalgoChars = ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯'];
  
  const zalgo = text.split('').map(char => {
    const numMarks = Math.floor(Math.random() * 3) + 1;
    let result = char;
    for (let i = 0; i < numMarks; i++) {
      result += zalgoChars[Math.floor(Math.random() * zalgoChars.length)];
    }
    return result;
  }).join('');
  
  return { 
    success: true, 
    message: `👹 **CHAOS CORRUPTION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nOriginal: ${text}\nCorrupted: ${zalgo}\n\nThe warp has claimed your text!` 
  };
}

function handleLeetSpeak(args) {
  const leetMap = {
    'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7', 'l': '1'
  };
  
  const text = args && args.length > 0 ? args.join(' ') : 'EMPEROR';
  const leet = text.toLowerCase().split('').map(char => leetMap[char] || char).join('');
  
  return { 
    success: true, 
    message: `👾 **L33T SP34K**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nOriginal: ${text}\nL33t: ${leet}\n\nH4CK3R m0d3 4c71v473d!` 
  };
}

function handleMock(args) {
  const text = args && args.length > 0 ? args.join(' ') : 'this is fine';
  const mocked = text.split('').map((char, index) => 
    index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
  ).join('');
  
  return { 
    success: true, 
    message: `🙄 **MOCKING TEXT**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nOriginal: ${text}\nMocked: ${mocked}\n\nSarcasm protocols engaged.` 
  };
}

function handleClap(args) {
  const text = args && args.length > 0 ? args.join(' ') : 'EMPEROR PROTECTS';
  const clapped = text.split(' ').join(' 👏 ');
  
  return { 
    success: true, 
    message: `👏 **EMPHASIS AMPLIFIER**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${clapped}\n\nApplause enhancement complete.` 
  };
}

function handleRainbow(args) {
  const text = args && args.length > 0 ? args.join(' ') : 'EMPEROR';
  const colors = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'];
  
  const rainbow = text.split('').map((char, index) => 
    colors[index % colors.length] + char
  ).join('');
  
  return { 
    success: true, 
    message: `🌈 **RAINBOW TEXT**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${rainbow}\n\nSpectral enhancement applied.` 
  };
}

function handleFiglet(args) {
  const text = args && args.length > 0 ? args[0].toUpperCase() : 'AI';
  
  // Simple ASCII art for common letters
  const ascii = {
    'A': ['  █  ', ' ███ ', '█   █', '█████', '█   █'],
    'I': ['█████', '  █  ', '  █  ', '  █  ', '█████'],
    'E': ['█████', '█    ', '████ ', '█    ', '█████']
  };
  
  const result = ascii[text[0]] || ['?????', '?????', '?????', '?????', '?????'];
  
  return { 
    success: true, 
    message: `🎨 **ASCII ART**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\`\`\`\n${result.join('\n')}\n\`\`\`\nMonumental text rendering complete.` 
  };
}

function handleBox(args) {
  const text = args && args.length > 0 ? args.join(' ') : 'EMPEROR PROTECTS';
  const width = text.length + 4;
  const top = '┌' + '─'.repeat(width - 2) + '┐';
  const middle = '│ ' + text + ' │';
  const bottom = '└' + '─'.repeat(width - 2) + '┘';
  
  return { 
    success: true, 
    message: `📦 **TEXT CONTAINER**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\`\`\`\n${top}\n${middle}\n${bottom}\n\`\`\`\nSecure text containment achieved.` 
  };
}

function handleTable(args) {
  const sampleTable = `
| Rank       | Name        | Loyalty | Purity |
|------------|-------------|---------|--------|
| Captain    | Marcus      | 100%    | Pure   |
| Sergeant   | Brutus      | 98%     | Pure   |
| Marine     | Gaius       | 95%     | Pure   |
`;
  
  return { 
    success: true, 
    message: `📊 **DATA TABLE**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\`\`\`${sampleTable}\`\`\`\nTabular data formatted for Imperial review.` 
  };
}

function handleChart(args) {
  const data = [85, 92, 78, 96, 89];
  const maxVal = Math.max(...data);
  
  let chart = '📈 **PERFORMANCE CHART**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n```\n';
  data.forEach((val, index) => {
    const bars = Math.floor((val / maxVal) * 20);
    const bar = '█'.repeat(bars) + '░'.repeat(20 - bars);
    chart += `Week ${index + 1}: ${bar} ${val}%\n`;
  });
  chart += '```\nImperial efficiency metrics displayed.';
  
  return { success: true, message: chart };
}

function handleGraph(args) {
  const points = [3, 7, 2, 8, 5, 9, 4];
  let graph = '📊 **DATA VISUALIZATION**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n```\n';
  
  for (let y = 10; y >= 0; y--) {
    let line = y.toString().padStart(2) + '│';
    points.forEach(point => {
      line += point >= y ? '██' : '  ';
    });
    graph += line + '\n';
  }
  graph += '  └' + '──'.repeat(points.length) + '\n';
  graph += '   ' + points.map((_, i) => (i + 1).toString().padStart(2)).join('');
  graph += '\n```\nGraphical data representation complete.';
  
  return { success: true, message: graph };
}

function handleProgress(args) {
  const percentage = args && args[0] ? Math.min(100, Math.max(0, parseInt(args[0]))) : Math.floor(Math.random() * 101);
  const filled = Math.floor(percentage / 5);
  const empty = 20 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  
  return { 
    success: true, 
    message: `📊 **PROGRESS INDICATOR**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n[${bar}] ${percentage}%\n\nImperial objectives advancing.` 
  };
}

function handleLoading() {
  const frames = ['|', '/', '-', '\\'];
  const frame = frames[Math.floor(Math.random() * frames.length)];
  
  return { 
    success: true, 
    message: `⏳ **LOADING SEQUENCE**\n━━━━━━━━━━━━━━━━━━━━━━━━━\nProcessing... ${frame}\n\nMachine spirit calculating...` 
  };
}

function handleSpinner() {
  const spinners = ['◐', '◓', '◑', '◒'];
  const spinner = spinners[Math.floor(Math.random() * spinners.length)];
  
  return { 
    success: true, 
    message: `🔄 **PROCESSING INDICATOR**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n${spinner} Working...\n\nCogitators engaged.` 
  };
}

// Helper function to create spoiler content
function createSpoiler(content) {
  return `<span class="spoiler">${content}</span>`;
}
