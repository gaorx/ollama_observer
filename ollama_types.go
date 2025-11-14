package main

import (
	oapi "github.com/ollama/ollama/api"
)

type (
	ChatTool     = oapi.Tool
	ChatToolCall = oapi.ToolCall
	ChatMessage  = oapi.Message
	ChatRequest  = oapi.ChatRequest
	ChatResponse = oapi.ChatResponse
)
