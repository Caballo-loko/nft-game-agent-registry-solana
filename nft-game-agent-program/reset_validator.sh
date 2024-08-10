#!/bin/bash

# Remove existing ledger files
rm -rf test-ledger

# Create a new ledger directory
mkdir test-ledger

# Clean hidden macOS files
find test-ledger -name "._*" -exec rm -f {} \;

# Update Solana CLI tools
solana-install update

# Set Solana configuration
solana config set --url localhost
solana config set --keypair /Users/caballoloko/.config/solana/id.json

# Start the test validator
solana-test-validator --ledger test-ledger --reset &

# Wait for the test validator to start
sleep 20

# Run the tests
yarn run ts-mocha -p ./tsconfig.json -t 1000000 'tests/**/*.ts'
