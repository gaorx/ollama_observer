package main

import (
	oapi "github.com/ollama/ollama/api"
)

type (
	ChatTool     = oapi.Tool
	ChatRequest  = oapi.ChatRequest
	ChatResponse = oapi.ChatResponse
)
