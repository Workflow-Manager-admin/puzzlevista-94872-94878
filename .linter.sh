#!/bin/bash
cd /home/kavia/workspace/code-generation/puzzlevista-94872-94878/main_container_for_puzzlevista
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

