#!/bin/bash

# Script to generate gRPC-Web client code from proto files
# Usage: ./generate-proto.sh

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}gRPC-Web Proto Generator${NC}"
echo "========================================"

# Check if protoc is installed
if ! command -v protoc &> /dev/null; then
    echo -e "${RED}Error: protoc is not installed${NC}"
    echo "Please install Protocol Buffers compiler:"
    echo "  macOS: brew install protobuf"
    echo "  Ubuntu/Debian: apt-get install protobuf-compiler"
    echo "  or download from: https://github.com/protocolbuffers/protobuf/releases"
    exit 1
fi

# Check if protoc-gen-grpc-web is installed
if ! command -v protoc-gen-grpc-web &> /dev/null; then
    echo -e "${RED}Error: protoc-gen-grpc-web is not installed${NC}"
    echo "Please install the gRPC-Web protoc plugin:"
    echo "  Download from: https://github.com/grpc/grpc-web/releases"
    echo "  And add to your PATH"
    exit 1
fi

# Proto file location
PROTO_DIR="../spienx-hub/src/git/grpc"
PROTO_FILE="git.proto"
OUTPUT_DIR="./src/proto"

# Check if proto file exists
if [ ! -f "$PROTO_DIR/$PROTO_FILE" ]; then
    echo -e "${RED}Error: Proto file not found at $PROTO_DIR/$PROTO_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}Generating gRPC-Web client code...${NC}"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Clean up old files
rm -f "$OUTPUT_DIR"/*.js "$OUTPUT_DIR"/*.ts "$OUTPUT_DIR"/*.d.ts

# Generate TypeScript client and messages using ts-proto
echo "Generating TypeScript client and messages using ts-proto..."
protoc -I="$PROTO_DIR" \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out="$OUTPUT_DIR" \
  --ts_proto_opt=outputServices=nice-grpc,outputServices=generic-definitions,env=browser,esModuleInterop=true,useOptionals=messages \
  "$PROTO_DIR/$PROTO_FILE"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to generate proto files${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Successfully generated gRPC-Web client code (ts-proto)${NC}"
echo "Output files:"
ls -lh "$OUTPUT_DIR"/*.ts 2>/dev/null | awk '{print "  - " $9 " (" $5 ")"}'
echo ""
echo -e "${YELLOW}Note: Update gitService to use the generated TypeScript files${NC}"
