# simli-millis-demo
 Simli Facial Lipsync + Millis AI Agent demo 
 
 ## Try Demo
 1. Rename .env_sample to .env and paste your API keys
```js
NEXT_PUBLIC_SIMLI_API_KEY= YOUR-SIMLI-KEY
NEXT_PUBLIC_MILLIS_API_KEY= YOUR-MILLIS-KEY
```

Simli: [GET API KEY](https://www.simli.com/profile)
`
Millis: [GET API KEY](https://www.millis.ai/)

2. Install packages
```bash
npm install
```
```bash
cd @millisai/web-sdk
npm install
cd ../..
```

3. Put your Simli FaceID and Millis AgentID

Go to `./app/page.tsx` and change the following

```
const simli_faceid = "SIMLI-FACE-ID";`
const millis_agentid = "MILLIS-AGENT-ID";
```
`
Simli Faces: [AVAILABLE FACES](https://docs.simli.com/api-reference/available-faces)

Millis: Create an Agent through Millis dashboard

4. Run
```bash
npm run dev
```
