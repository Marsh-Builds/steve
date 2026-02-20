# Steve

> Have real-time voice conversations with history's greatest minds.

Pick a historical figure — Steve Jobs, Marcus Aurelius, Cleopatra, Einstein, da Vinci, or Tesla — and talk to them live. Powered by OpenAI's Realtime API with WebRTC for ultra-low latency voice.

![Steve Screenshot](screenshot.png)

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **OpenAI Realtime API** (WebRTC)

## Setup

```bash
git clone https://github.com/BotMarsh1/steve.git
cd steve
npm install
```

Create `.env.local`:

```
OPENAI_API_KEY=sk-your-key-here
```

Run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

1. You pick a historical figure from the grid
2. The app requests an ephemeral token from `/api/realtime/token` with the figure's system prompt and voice
3. A WebRTC connection is established directly with OpenAI's Realtime API
4. You speak, the AI responds in real-time with the figure's voice and personality
5. Transcripts appear live on screen

## Adding New Figures

Edit `src/data/figures.ts` and add a new entry to the `figures` array:

```ts
{
  id: "your-figure",
  name: "Name",
  era: "Birth–Death",
  tagline: "A memorable quote",
  avatar: "https://url-to-image.jpg",
  voiceId: "alloy", // alloy, echo, fable, onyx, nova, shimmer
  color: "#hexcolor",
  systemPrompt: `Your detailed character prompt here...`,
}
```

## License

MIT
