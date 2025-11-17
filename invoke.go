package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"strings"
	"time"
)

type Invoke struct {
	ID             string
	At             time.Time
	Method         string
	Path           string
	RequestHeader  http.Header
	RequestBody    []byte
	ResponseStatus int
	ResponseHeader http.Header
	ResponseBody   []byte

	// Computed fields
	Chat struct {
		Request  *ChatRequest
		Response *ChatResponse
	}
}

type InvokeResponse struct {
	ID             string            `json:"id"`
	At             time.Time         `json:"at"`
	Method         string            `json:"method"`
	Path           string            `json:"path"`
	Status         int               `json:"status"`
	RequestHeader  map[string]string `json:"request_header"`
	RequestBody    any               `json:"request_body"`
	ResponseHeader map[string]string `json:"response_header"`
	ResponseBody   any               `json:"response_body"`
}

func (i *Invoke) SelectRequest() any {
	if i.Path == "/api/chat" {
		return i.Chat.Request
	} else {
		return nil
	}
}

func (i *Invoke) SelectResponse() any {
	if i.Path == "/api/chat" {
		return i.Chat.Response
	} else {
		return nil
	}
}

func (i *Invoke) Init() error {
	if i.Path == "/api/chat" {
		return i.initChat()
	}
	return nil
}

func (i *Invoke) initChat() error {
	// request
	var req ChatRequest
	if err := json.Unmarshal(i.RequestBody, &req); err != nil {
		return err
	}
	i.Chat.Request = &req

	// response
	var resp ChatResponse
	lines := strings.Split(string(i.ResponseBody), "\n")
	if len(lines) > 1 {
		// streaming response
		contentBuffer := bytes.NewBufferString("")
		thinkingBuffer := bytes.NewBufferString("")
		var toolCalls []ChatToolCall = nil

		appendChunk := func(chunk *ChatResponse) {
			if chunk.Message.Content != "" {
				contentBuffer.WriteString(chunk.Message.Content)
			}
			if chunk.Message.Thinking != "" {
				thinkingBuffer.WriteString(chunk.Message.Thinking)
			}
			if len(chunk.Message.ToolCalls) > 0 {
				toolCalls = append(toolCalls, chunk.Message.ToolCalls...)
			}
		}

		for _, chunkLine := range lines {
			if len(chunkLine) == 0 {
				continue
			}
			var chunk ChatResponse
			if err := json.Unmarshal([]byte(chunkLine), &chunk); err != nil {
				return err
			}
			if !chunk.Done {
				appendChunk(&chunk)
			} else {
				appendChunk(&chunk)
				resp = chunk
				resp.Message.Content = contentBuffer.String()
				resp.Message.Thinking = thinkingBuffer.String()
				resp.Message.ToolCalls = toolCalls
				break
			}
		}
		i.Chat.Response = &resp
	} else {
		// non-streaming response
		if err := json.Unmarshal(i.ResponseBody, &resp); err != nil {
			return err
		}
		i.Chat.Response = &resp
	}
	return nil
}

func NewInvokeResponse(i *Invoke) *InvokeResponse {
	return &InvokeResponse{
		ID:             i.ID,
		At:             i.At.UTC(),
		Method:         i.Method,
		Path:           i.Path,
		Status:         i.ResponseStatus,
		RequestHeader:  httpHeaderToMap(i.RequestHeader),
		RequestBody:    i.SelectRequest(),
		ResponseHeader: httpHeaderToMap(i.ResponseHeader),
		ResponseBody:   i.SelectResponse(),
	}
}
