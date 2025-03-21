# Use Node.js base image for backend
FROM node:18 AS backend-builder

WORKDIR /app

# Copy backend dependencies
COPY nft-certificates/package.json nft-certificates/package-lock.json ./nft-certificates/
RUN cd nft-certificates && npm install && npm install -g truffle

# Copy backend source code
COPY nft-certificates ./nft-certificates/

# Compile smart contracts 
RUN cd nft-certificates && truffle compile

# --------------------------------------------------------------------------------------------

# Use Node.js base image for frontend
FROM node:18 AS frontend-builder

WORKDIR /app

# Copy frontend dependencies
COPY nft-certificates-app/package.json nft-certificates-app/package-lock.json ./frontend/
RUN cd frontend && npm i pinata && npm install

# Copy frontend source code
COPY nft-certificates-app ./frontend/

# Copy compiled contracts from backend build stage
COPY --from=backend-builder /app/nft-certificates/build/contracts ./nft-certificates/build/contracts/

# Build the frontend
RUN cd frontend && npm run build

# -----------------------------------------------------------------------------------------------------------------

# Final image to run the full application
FROM node:18

WORKDIR /app

# Copy backend and frontend from the previous stages
COPY --from=backend-builder /app/nft-certificates ./nft-certificates/
COPY --from=frontend-builder /app/frontend ./frontend/
RUN npm install -g truffle

# Expose frontend port
EXPOSE 3000

# Start both backend and frontend at runtime
CMD ["sh", "-c", "cd nft-certificates && truffle migrate --network development && truffle exec identity.js && cd ../frontend && npm run start"]
