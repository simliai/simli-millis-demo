"use strict";var I=Object.create;var p=Object.defineProperty;var T=Object.getOwnPropertyDescriptor;var P=Object.getOwnPropertyNames,C=Object.getOwnPropertySymbols,U=Object.getPrototypeOf,D=Object.prototype.hasOwnProperty,F=Object.prototype.propertyIsEnumerable;var x=(i,a,t)=>a in i?p(i,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[a]=t,v=(i,a)=>{for(var t in a||(a={}))D.call(a,t)&&x(i,t,a[t]);if(C)for(var t of C(a))F.call(a,t)&&x(i,t,a[t]);return i};var _=(i,a)=>{for(var t in a)p(i,t,{get:a[t],enumerable:!0})},E=(i,a,t,e)=>{if(a&&typeof a=="object"||typeof a=="function")for(let s of P(a))!D.call(i,s)&&s!==t&&p(i,s,{get:()=>a[s],enumerable:!(e=T(a,s))||e.enumerable});return i};var M=(i,a,t)=>(t=i!=null?I(U(i)):{},E(a||!i||!i.__esModule?p(t,"default",{value:i,enumerable:!0}):t,i)),W=i=>E(p({},"__esModule",{value:!0}),i);var l=(i,a,t)=>new Promise((e,s)=>{var n=o=>{try{u(t.next(o))}catch(c){s(c)}},r=o=>{try{u(t.throw(o))}catch(c){s(c)}},u=o=>o.done?e(o.value):Promise.resolve(o.value).then(n,r);u((t=t.apply(i,a)).next())});var z={};_(z,{AgentState:()=>A,default:()=>B});module.exports=W(z);var w={};_(w,{createClient:()=>j,createMicrophoneAudioTrack:()=>b});var N=require("eventemitter3");var R=M(require("eventemitter3"));var k=`
class captureAndPlaybackProcessor extends AudioWorkletProcessor {
    audioData = [];
    index = 0;
    pause = false;

    constructor() {
      super();
      //set listener to receive audio data, data is float32 array.
      this.port.onmessage = (e) => {
        if (e.data === "clear") {
          // Clear all buffer.
          this.audioData = [];
          this.index = 0;
        } else if (e.data === "pause") {
          this.pause = true;
        } else if (e.data === "unpause") {
          this.pause = false;
        } else if (e.data.length > 0) {
          this.audioData.push(this.convertUint8ToFloat32(e.data));
        }
      };
    }

    convertUint8ToFloat32(array) {
      const targetArray = new Float32Array(array.byteLength / 2);

      // A DataView is used to read our 16-bit little-endian samples out of the Uint8Array buffer
      const sourceDataView = new DataView(array.buffer);

      // Loop through, get values, and divide by 32,768
      for (let i = 0; i < targetArray.length; i++) {
        targetArray[i] = sourceDataView.getInt16(i * 2, true) / Math.pow(2, 16 - 1);
      }
      return targetArray;
    }

    convertFloat32ToUint8(array) {
      const buffer = new ArrayBuffer(array.length * 2);
      const view = new DataView(buffer);

      for (let i = 0; i < array.length; i++) {
        const value = array[i] * 32768;
        view.setInt16(i * 2, value, true); // true for little-endian
      }

      return new Uint8Array(buffer);
    }

    process(inputs, outputs, parameters) {
      // Capture
      const input = inputs[0];
      const inputChannel1 = input[0];
      const inputChannel2 = input[1];
      this.port.postMessage(this.convertFloat32ToUint8(inputChannel1));

      // Playback
      // const output = outputs[0];
      // const outputChannel1 = output[0];
      // const outputChannel2 = output[1];
      // // start playback.
      // for (let i = 0; i < outputChannel1.length; ++i) {
      //   if (this.audioData.length > 0 && !this.pause) {
      //     outputChannel1[i] = this.audioData[0][this.index];
      //     outputChannel2[i] = this.audioData[0][this.index];
      //     this.index++;
      //     if (this.index == this.audioData[0].length) {
      //       this.audioData.shift();
      //       this.index = 0;
      //       if (this.audioData.length == 0) {
      //         this.port.postMessage("playback_finished");
      //       }
      //     }
      //   } else {
      //     outputChannel1[i] = 0;
      //     outputChannel2[i] = 0;
      //   }
      // }

      return true;
    }
  }

  registerProcessor(
    "capture-and-playback-processor",
    captureAndPlaybackProcessor,
  );
`;var h=require("@alexanderolsen/libsamplerate-js");var L=16e3,f=class extends R.default{constructor(t){super();this.audioContext=null;this.stream=null;this.audioNode=null;this.captureNode=null;this.audioData=[];this.audioDataIndex=0;this.pause=!1;this.needResample=!1;this.resamplerCreated=!1;this.config=t}print(t){this.config.debug&&console.log("[millis audio service]",t)}start(){return l(this,null,function*(){let t=L;this.isFirefox()?(this.audioContext=new AudioContext({latencyHint:"interactive"}),this.needResample=!0):(this.needResample=!1,this.audioContext=new AudioContext({latencyHint:"interactive",sampleRate:t})),this.print("starting audio service, firefox: "+this.isFirefox()+", need resample: "+this.needResample);try{this.print("requesting microphone permission"),this.stream=yield b(t),this.print("microphone permission granted")}catch(e){throw this.print("microphone permission denied"),new Error("User didn't give microphone permission")}if(this.print("starting audio capture and playback processor, worklet: "+this.isAudioWorkletSupported()),this.isAudioWorkletSupported()){this.print("Starting audio worklet"),this.audioContext.resume();let e=new Blob([k],{type:"application/javascript"}),s=URL.createObjectURL(e);yield this.audioContext.audioWorklet.addModule(s),this.print("Audio worklet loaded"),this.audioNode=new AudioWorkletNode(this.audioContext,"capture-and-playback-processor"),this.print("Audio worklet setup"),this.audioNode.port.onmessage=o=>{o.data instanceof Uint8Array?this.emit("data",o.data):o.data==="playback_finished"&&this.onPlaybackFinished()};let n=this.audioContext.createMediaStreamSource(this.stream);n.connect(this.audioNode),this.audioNode.connect(this.audioContext.destination);let r=this.audioContext.createAnalyser();n.connect(r),this.emit("useraudioready",{analyser:r,stream:this.stream});let u=this.audioContext.createAnalyser();this.audioNode.connect(u),u.connect(this.audioContext.destination),this.emit("analyzer",u)}else{this.print("Starting audio capture node");let e=this.audioContext.createMediaStreamSource(this.stream);this.captureNode=this.audioContext.createScriptProcessor(2048,1,1),this.captureNode.onaudioprocess=r=>{if(this.captureNode&&this.audioContext){if(this.needResample&&!this.resamplerCreated){let d=h.ConverterType.SRC_SINC_FASTEST,S=1;this.resamplerCreated=!0,(0,h.create)(S,this.audioContext.sampleRate,t,{converterType:d}).then(y=>{this.inputResampler=y}),(0,h.create)(S,t,this.audioContext.sampleRate,{converterType:d}).then(y=>{this.outputResampler=y})}var u=r.inputBuffer.getChannelData(0),o=null;this.inputResampler!=null?o=this.inputResampler.full(u):o=u;let c=V(o);this.emit("data",c);let m=r.outputBuffer.getChannelData(0);for(let d=0;d<m.length;++d)this.audioData.length>0&&!this.pause?(m[d]=this.audioData[0][this.audioDataIndex++],this.audioDataIndex===this.audioData[0].length&&(this.audioData.shift(),this.audioDataIndex=0,this.audioData.length==0&&this.onPlaybackFinished())):m[d]=0}},e.connect(this.captureNode),this.captureNode.connect(this.audioContext.destination),this.print("Audio capture node setup");let s=this.audioContext.createAnalyser();e.connect(s),this.emit("useraudioready",{analyser:s,stream:this.stream});let n=this.audioContext.createAnalyser();this.captureNode.connect(n),n.connect(this.audioContext.destination),this.emit("analyzer",n)}})}stop(){return l(this,null,function*(){var t,e,s,n;(t=this.audioContext)==null||t.suspend(),(e=this.audioContext)==null||e.close(),this.isAudioWorkletSupported()?((s=this.audioNode)==null||s.disconnect(),this.audioNode=null):this.captureNode&&(this.captureNode.disconnect(),this.captureNode.onaudioprocess=null,this.captureNode=null,this.audioData=[],this.audioDataIndex=0),(n=this.stream)==null||n.getTracks().forEach(r=>r.stop()),this.audioContext=null,this.stream=null})}play(t){var s;if(this.isAudioWorkletSupported())(s=this.audioNode)==null||s.port.postMessage(t);else{let n=O(t);var e=null;this.outputResampler!=null?e=this.outputResampler.full(n):e=n,this.audioData.push(e)}}setpause(t){var e;this.isAudioWorkletSupported()?(e=this.audioNode)==null||e.port.postMessage(t?"pause":"unpause"):this.pause=t}reset(){var t;this.isAudioWorkletSupported()?(t=this.audioNode)==null||t.port.postMessage("clear"):(this.audioData=[],this.audioDataIndex=0)}onPlaybackFinished(){this.emit("playback_finished")}isAudioWorkletSupported(){return/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor)}isFirefox(){return/Firefox/.test(navigator.userAgent)}};function O(i){let a=new Float32Array(i.byteLength/2),t=new DataView(i.buffer);for(let e=0;e<a.length;e++)a[e]=t.getInt16(e*2,!0)/Math.pow(2,15);return a}function V(i){let a=new ArrayBuffer(i.length*2),t=new DataView(a);for(let e=0;e<i.length;e++){let s=i[e]*32768;t.setInt16(e*2,s,!0)}return new Uint8Array(a)}var A=(s=>(s.IDLE="idle",s.PREPARE_ANSWER="prepare_answer",s.ANSWER="answer",s.PAUSE="pause",s))(A||{});var G="wss://api-west.millis.ai:8080/millis";var g=class extends N.EventEmitter{constructor(t){super();this.startAnswering=0;this.count=0;this.agentState="idle";this.state=0;this.muted=!1;this.readyPayload=void 0;this.ws=null,this.audioService=null,this.latencyEstimator=null;let e={isTest:!1,debug:!1};this.config=v(v({},e),t),this.print("init")}reset(){this.state=0,this.agentState="idle",this.count=0,this.startAnswering=0,this.muted=!1}print(t){this.config.debug&&console.log("[millis]",t)}connect(t,e,s){this.print("starting websocket"),this.ws=new WebSocket(this.config.endPoint||G),this.ws.binaryType="arraybuffer";let n=typeof t=="string"?{agent_id:t}:{agent_config:t};this.ws.onopen=()=>{this.print("websocket connected, sending initiate message"),this.emit("onopen"),this.send(JSON.stringify({method:"initiate",data:{agent:n,public_key:this.config.publicKey,metadata:e,include_metadata_in_prompt:s}}))},this.ws.onmessage=r=>{var u;if(r.data instanceof ArrayBuffer){this.print("audio data received"),this.startAnswering>0&&(this.emit("onlatency",Date.now()-this.startAnswering),this.print("latency: "+(Date.now()-this.startAnswering)),this.startAnswering=0,this.switchState("answer"));let o=new Uint8Array(r.data);(u=this.audioService)==null||u.play(o),this.emit("onaudio",o)}else{let o=JSON.parse(r.data);if(o.method==="onready"){this.onready(o.payload);return}this.handle(o)||this.emit(o.method,o.data,o.payload),this.print(`received ${o.method}`)}},this.ws.onclose=r=>{this.stop(),this.emit("onclose",r),this.print("websocket disconnected"),this.switchState("idle")},this.ws.onerror=r=>{this.stop(),this.emit("onerror",r),this.print("websocket error: "+r)}}send(t){var e;((e=this.ws)==null?void 0:e.readyState)===1&&this.ws.send(t)}handle(t){var e,s,n;switch(t.method){case"start_answering":return this.startAnswering=Date.now(),this.switchState("prepare_answer"),!0;case"clear":return(e=this.audioService)==null||e.reset(),this.switchState("idle"),!0;case"pause":return(s=this.audioService)==null||s.setpause(!0),this.switchState("pause"),!0;case"unpause":return(n=this.audioService)==null||n.setpause(!1),this.switchState("answer"),!0;case"pong":return this.print("Ping rtt "+(Date.now()-Number(t.data))),!0}return!1}onready(t){this.readyPayload=t,this.switchState("idle"),this.switchConnectionState(2)}start(t,e,s){return l(this,null,function*(){this.print("starting conversation"),this.audioService=new f(this.config),this.audioService.on("data",n=>{this.muted?n.fill(0):this.print("sending audio data"),this.send(n),this.count++,this.count%1e3==0&&(this.print("sending ping"),this.send(JSON.stringify({method:"ping",data:Date.now().toString()}))),this.switchConnectionState(3)}),this.audioService.on("analyzer",n=>{this.emit("analyzer",n)}),this.audioService.on("useraudioready",n=>{this.print("user audio ready"),this.emit("useraudioready",n)}),this.audioService.on("playback_finished",()=>{this.agentState==="answer"&&this.switchState("idle")}),this.print("starting audio service"),yield this.audioService.start(),this.print("audio service started"),this.connect(t,e,s)})}stop(){return l(this,null,function*(){var t;this.audioService&&(this.print("stopping audio service"),this.audioService.stop(),this.audioService=null,this.print("audio service stopped")),(t=this.ws)==null||t.close(),this.reset()})}mute(){this.muted=!0}unmute(){this.muted=!1}switchState(t){this.agentState=t,this.emit("onagentstate",t)}switchConnectionState(t){this.state===0?this.state=t:(this.state===3&&t===2||this.state===2&&t===3)&&(this.state=1,this.emit("onready",this.readyPayload))}};function j(i){return new g(i)}function b(i){return l(this,null,function*(){return navigator.mediaDevices.getUserMedia({audio:{sampleRate:i,echoCancellation:!0,noiseSuppression:!0,channelCount:1,autoGainControl:!0,latency:0}})})}var B=w;0&&(module.exports={AgentState});
//# sourceMappingURL=index.js.map