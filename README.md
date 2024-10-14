# simli-millis-demo
 Simli Facial Lipsync + Millis AI Agent demo 
 
 ## Try Demo
 ### 1. Keys
Rename .env_sample to .env and paste your API keys: [SIMLI API KEY](https://www.simli.com/profile) and [MILLIS API KEY](https://www.millis.ai/)
```js
NEXT_PUBLIC_SIMLI_API_KEY = 'YOUR-SIMLI-KEY'
NEXT_PUBLIC_MILLIS_API_KEY = 'YOUR-MILLIS-KEY'
```

### 2. Install packages
First install npm packages
```bash
npm install
```
Then install millis packages
```bash
cd @millisai/web-sdk
```
```bash
npm install
```
```bash
cd ../..
```

### 3. Customize your agent
Go to `./app/page.tsx` and change your Simli FaceID and Millis AgentID. <br/>
Check availave simli faces: [AVAILABLE FACES](https://docs.simli.com/api-reference/available-faces)
```bash
const simli_faceid = "SIMLI-FACE-ID";
const millis_agentid = "MILLIS-AGENT-ID";
```

### 4. Finally Run
```bash
npm run dev
```
