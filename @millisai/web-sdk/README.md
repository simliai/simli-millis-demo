# Millis AI Web SDK

Welcome to the Millis AI Web SDK! This SDK enables you to integrate Millis AI's voice agent capabilities directly into your web applications and browser extensions. 

## Installation

Install the SDK with npm:

```
npm install @millisai/web-sdk
```

## Usage

Here’s how to quickly set up a voice agent in your web application:

### 1. Import the SDK:

```js
import Millis from '@millisai/web-sdk';
```

### 2. Initialize the Client:

```js
const msClient = Millis.createClient({publicKey: 'your_public_key'});
```

Obtain your public key from your [Millis AI Playground](https://app.millis.ai/settings/keys)

### 3. Start a Conversation:

#### Using a Predefined Agent

First, create a voice agent from the [Playground](https://app.millis.ai/agents). Then, start a conversation with your agent using the following code:

```js
msClient.start(<agent-id>);
```

Replace 'agent-id' with the ID of your agent obtained from the Playground.

#### Dynamically Creating a Temporary Voice Agent

You can also dynamically create a temporary voice agent with custom configurations using the code below:

```js
msClient.start({
  prompt: "You're a helpful assistant.", // Example prompt
  voice: {
    provider: "elevenlabs", // Voice provider
    name: "voice-id" // Replace 'voice-id' with the ID of the desired voice
  },
  tools: ["list of function calls"] // Replace with actual function calls you need
});
```

### 4. Stop a Conversation:

```js
msClient.stop();
```

### 5. Setup event listener:

```js
    msClient.on("onopen", () => {
      // When the client connected to the server
    });

    msClient.on("onready", () => {
      // When the conversation is ready 
    });

    msClient.on("onaudio", (audio: Uint8Array) => {
      // Incoming audio chunk
    });

    msClient.on("analyzer", (analyzer: AnalyserNode) => {
      // AnalyserNode that you can use for audio animation
    });

    msClient.on("onclose", (event) => {
      // When the connection is closed
    });

    msClient.on("onerror", (error) => {
      // An error occurred
    });
```

## Support

If you encounter any issues or have questions, please reach out to us directly at thach@millis.ai.
