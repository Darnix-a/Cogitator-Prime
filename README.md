# AI Assistant - Warhammer 40K Themed Desktop App

A Warhammer 40K-themed AI desktop assistant built with Electron, featuring over 120 modular commands, a snarky customizable personality, and integration with Claude/chatgpt via OpenRouter. Whether you're logging moods, purging to-dos, or receiving brutal roasts — Cogitator Prime is your grimdark co-pilot for daily productivity.

## Features

- **Modular Command System**: Easy to add new commands
- **Local Data Storage**: All personal data stored locally in JSON files
- **Personality Modes**: Switch between snarky, helpful, and lazy personalities
- **Modern UI**: Clean interface with smooth animations

## Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up OpenRouter API Key:**
   - Get your API key from [OpenRouter](https://openrouter.ai/)
   - Run the app and use: `/config apikey YOUR_API_KEY`
   - Or edit `config.json` directly

3. **Run the App:**
   ```bash
   npm start
   ```

   For development mode:
   ```bash
   npm run dev
   ```


## Architecture

- **Electron**: Desktop app framework
- **OpenRouter**: Claude API integration
- **Node.js**: Backend command processing
- **Vanilla JS**: Frontend (no frameworks for minimal bloat)
- **JSON Storage**: Local data persistence

## Customization

The app is designed to be easily extensible:

1. **Add new commands**: Edit the `handleCommand` function in `main.js`
2. **Modify personality**: Edit the personality prompts in the `callClaude` function
3. **Change UI**: Modify `style.css` for visual customization
4. **Add data storage**: Create new JSON files in the `data/` directory

## Keyboard Shortcuts

- **Ctrl+L**: Clear chat history
- **Escape**: Focus input field
- **Enter**: Send command

## The Emperor Protects

This assistant serves the Emperor's will through the power of the machine spirit. Use it wisely, for in the grim darkness of the far future, there is only productivity.

---

*For the Emperor! 🤖⚔️*
