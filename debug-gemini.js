const https = require('https');
const fs = require('fs');
const path = require('path');

// Basic .env parser
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const content = fs.readFileSync(envPath, 'utf8');
        const env = {};
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                let value = match[2].trim();
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                env[match[1].trim()] = value;
            }
        });
        return env;
    } catch (e) {
        return {};
    }
}

const env = loadEnv();
const apiKey = env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found in .env.local");
    process.exit(1);
}

console.log(`✅ Found API Key: ${apiKey.substring(0, 4)}...`);

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error(`❌ Error fetching models: ${res.statusCode} ${res.statusMessage}`);
            console.error(data);
        } else {
            const response = JSON.parse(data);
            console.log("✅ Available Models:");
            if (response.models) {
                response.models.forEach(m => console.log(` - ${m.name}`));
            } else {
                console.log("No models found in response:", response);
            }
        }
    });
}).on('error', (e) => {
    console.error(e);
});
