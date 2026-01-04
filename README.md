# Web Agent - AI-Powered Browser Extension

✨ Ollama-powered AI agent that injects a side panel into any webpage with local LLM capabilities.

## Features

- 🤖 **Local AI** - Uses Ollama running locally on your machine (no cloud dependencies)
- 📍 **Side Panel UI** - Clean, modern side panel injected on all web pages
- 🔒 **Privacy** - All processing happens locally
- ⚡ **Fast** - Direct communication with Ollama API

## Installation

### Prerequisites

1. **Chrome/Chromium browser**
2. **Ollama** - Download from https://ollama.ai
3. **A model** - Pull a model like `ollama pull llama2`

### Setup Steps

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/tasubimuloka41-a11y/y-ussalsya.git
   cd y-ussalsya/extension
   ```

2. **Start Ollama with port 11435**
   ```powershell
   # Windows PowerShell
   $env:OLLAMA_HOST="127.0.0.1:11435"
   ollama serve
   ```
   
   Or on Linux/Mac:
   ```bash
   OLLAMA_HOST=127.0.0.1:11435 ollama serve
   ```

3. **Load the extension in Chrome**
   - Open `chrome://extensions`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `extension` folder from this repo
   - The extension will appear in your toolbar

4. **Use the extension**
   - Click the extension icon to open the side panel
   - Type your question and press Enter
   - The AI will respond using your local Ollama model

## Files Structure

```
y-ussalsya/
├── extension/
│   ├── manifest.json      - Extension configuration
│   ├── agent.js          - Ollama API client
│   ├── background.js     - Service worker
│   ├── content.js        - Side panel injection
│   └── sidepanel.html    - Side panel UI
├── index.html            - GitHub Pages demo
└── README.md             - This file
```

## Troubleshooting

### "Error: HTTP 0" message
- **Problem**: Ollama is not running
- **Solution**: Start Ollama with the correct command above
- **Verify**: Open PowerShell and run `curl http://127.0.0.1:11435`

### Side panel not showing
- **Problem**: Extension not loaded properly
- **Solution**: 
  1. Go to `chrome://extensions`
  2. Disable and re-enable the extension
  3. Reload the webpage

### Messages not being sent
- **Problem**: Ollama model not loaded
- **Solution**: Run `ollama list` to see loaded models
- **Fix**: Run `ollama pull llama2` to download the default model

## Configuration

To change the Ollama URL or model, edit these files:

- **extension/agent.js** - Line 3: `const OLLAMA_URL`
- **extension/agent.js** - Line 4: `const MODEL`
- **index.html** - Line 217: `const OLLAMA_URL`

Default:
- URL: `http://127.0.0.1:11435/api/generate`
- Model: `llama2`

## Live Demo

Try the embedded version at: https://tasubimuloka41-a11y.github.io/y-ussalsya/

(Note: Requires local Ollama running)

## License

MIT License - Feel free to use and modify

## Contributing

Contributions welcome! Fork and submit pull requests.
