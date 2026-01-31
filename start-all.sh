#!/bin/bash

# Kill ports
fuser -k 3000/tcp 4000/tcp 5000/tcp || true

# Start AI Engine
echo "Starting AI Engine..."
cd apps/ai-engine
if [ -d "venv" ]; then
    source venv/bin/activate
else
    python -m venv venv
    source venv/bin/activate
fi
pip install -r requirements.txt
python app.py &
AI_PID=$!
cd ../..

# Start API Gateway
echo "Starting API Gateway..."
cd apps/api-gateway
npm install
node index.js &
GATEWAY_PID=$!
cd ../..

# Start Client
echo "Starting Client..."
cd apps/client
npm install
npm run dev &
CLIENT_PID=$!
cd ../..

echo "All services started. Press Ctrl+C to stop."
wait $AI_PID $GATEWAY_PID $CLIENT_PID
