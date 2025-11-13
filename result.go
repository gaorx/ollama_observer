package main

type Result struct {
	Code  int    `json:"code"`
	Data  any    `json:"data,omitempty"`
	Error string `json:"error,omitempty"`
}

func NewResultOK(data any) *Result {
	return &Result{
		Code: 200,
		Data: data,
	}
}

func NewResultErr(code int, err string) *Result {
	return &Result{
		Code:  code,
		Error: err,
	}
}
