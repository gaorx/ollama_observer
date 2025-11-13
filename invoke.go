package main

import (
	"bytes"
	"encoding/json"
	"net/http"
)

type Invoke struct {
	ID             string
	At             int64
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
	At             string            `json:"at"`
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
	contentBuffer := bytes.NewBufferString("")
	lines := bytes.Split(i.ResponseBody, []byte{'\n'})
	for _, line := range lines {
		if len(line) == 0 {
			continue
		}
		var resp0 ChatResponse
		if err := json.Unmarshal(line, &resp0); err != nil {
			return err
		}
		if !resp0.Done {
			contentBuffer.WriteString(resp0.Message.Content)
		} else {
			resp = resp0
			resp.Message.Content = contentBuffer.String()
			break
		}
	}
	i.Chat.Response = &resp
	return nil
}

func NewInvokeResponse(i *Invoke) *InvokeResponse {
	return &InvokeResponse{
		ID:             i.ID,
		At:             fromTimestamp(i.At).Format("200"),
		Method:         i.Method,
		Path:           i.Path,
		Status:         i.ResponseStatus,
		RequestHeader:  httpHeaderToMap(i.RequestHeader),
		RequestBody:    i.SelectRequest(),
		ResponseHeader: httpHeaderToMap(i.ResponseHeader),
		ResponseBody:   i.SelectResponse(),
	}
}
