import { EventEmitter } from 'eventemitter3';

interface Config {
    publicKey: string;
    endPoint?: string;
    debug?: boolean;
}
type VoiceProvider = 'elevenlabs' | 'rime' | 'openai' | 'cartesia' | 'playht';
interface Tool {
    name: string;
    description: string;
    webhook: string;
    header: object;
    params: Param[];
}
interface Param {
    name: string;
    type: "string" | "number" | "boolean";
    description: string;
    required: boolean;
}
interface Voice {
    provider: VoiceProvider;
    voice_id: string;
}
interface AgentSetting {
    first_message?: string;
    vad_threshold?: number;
    privacy_settings?: {
        opt_out_data_collection: boolean;
    };
    session_timeout?: {
        max_duration: number;
        max_idle: number;
        message?: string;
    };
    custom_vocabulary?: {
        keywords?: object;
    };
    flow?: {
        user_start_first?: boolean;
        interruption?: {
            allowed: boolean;
            keep_interruption_message: boolean;
        };
        response_delay?: number;
    };
}
interface WebhookSetting {
    session_data_webhook?: string;
    extra_prompt_webhook?: string;
}
type AllSettings = AgentSetting & WebhookSetting;
interface AgentConfig extends AllSettings {
    prompt: string;
    voice: Voice;
    tools?: Tool[];
    language?: string;
    custom_llm_websocket?: string;
    llm?: {
        model: string;
    };
    [key: string]: any;
}
interface ClientEvents {
    'onopen': () => void;
    'onready': (payload?: {
        session_id?: string;
    }) => void;
    'onsessionended': () => void;
    'onaudio': (audio: Uint8Array) => void;
    'onresponsetext': (text: string, payload: {
        is_final?: boolean;
    }) => void;
    'ontranscript': (text: string, payload: {
        is_final?: boolean;
    }) => void;
    'analyzer': (analyzer: AnalyserNode) => void;
    'useraudioready': (data: {
        analyser: AnalyserNode;
        stream: MediaStream;
    }) => void;
    'onlatency': (latency: number) => void;
    'onclose': (event: CloseEvent) => void;
    'onerror': (error: Event) => void;
    'onagentstate': (state: AgentState) => void;
}
interface ClientInterface {
    start(idOrConfig: AgentConfig | string, metadata?: object, includeMetadataInPrompt?: boolean): Promise<void>;
    stop(): Promise<void>;
    mute(): void;
    unmute(): void;
}
declare enum AgentState {
    IDLE = "idle",
    PREPARE_ANSWER = "prepare_answer",
    ANSWER = "answer",
    PAUSE = "pause"
}

declare class Client extends EventEmitter<ClientEvents> implements ClientInterface {
    private config;
    private ws;
    private audioService;
    private startAnswering;
    private count;
    private latencyEstimator;
    private agentState;
    private state;
    private muted;
    private readyPayload;
    constructor(config: Config);
    private reset;
    private print;
    private connect;
    send(data: Uint8Array | string): void;
    private handle;
    private onready;
    start(idOrConfig: AgentConfig | string, metadata?: object, includeMetadataInPrompt?: boolean): Promise<void>;
    stop(): Promise<void>;
    mute(): void;
    unmute(): void;
    private switchState;
    private switchConnectionState;
}

declare function createClient(config: Config): Client;
declare function createMicrophoneAudioTrack(sampleRate: number): Promise<MediaStream>;

declare const Millis_createClient: typeof createClient;
declare const Millis_createMicrophoneAudioTrack: typeof createMicrophoneAudioTrack;
declare namespace Millis {
  export { Millis_createClient as createClient, Millis_createMicrophoneAudioTrack as createMicrophoneAudioTrack };
}

export { type AgentConfig, AgentState, type ClientEvents, type ClientInterface, type Config, type VoiceProvider, Millis as default };
