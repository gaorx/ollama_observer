package main

import (
	"bufio"
	"bytes"
	"io"
	"net"
	"net/http"
	"net/http/httputil"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/samber/lo"
)

var recordableAPIs = []string{
	"/api/chat",
}

func handleProxy(c *gin.Context) {
	reqPath := c.Request.URL.Path
	switch reqPath {
	case "/api/observer/all":
		apiObserverAll(c)
		return
	case "/api/observer/ids":
		apiObserverIds(c)
		return
	case "/api/observer/get":
		apiObserverGet(c)
		return
	default:
		if lo.Contains(recordableAPIs, reqPath) {
			proxyRecordable(c)
		} else {
			proxyTransparent(c)
		}
	}

}

func proxyRecordable(c *gin.Context) {
	config := c.MustGet("config").(*Config)
	req1, reqBody, err := wrapRequest(c.Request)
	if err != nil {
		c.String(http.StatusInternalServerError, "Failed to read request body: %v", err)
		return
	}
	writer1 := wrapResponseWriter(c.Writer)
	proxy := httputil.NewSingleHostReverseProxy(config.Remote)
	proxy.ServeHTTP(writer1, req1)
	i := &Invoke{
		ID:             lo.RandomString(8, lo.AlphanumericCharset),
		At:             toTimestamp(time.Now()),
		Method:         req1.Method,
		Path:           req1.URL.Path,
		RequestHeader:  req1.Header.Clone(),
		RequestBody:    reqBody,
		ResponseStatus: writer1.Status(),
		ResponseHeader: writer1.Header().Clone(),
		ResponseBody:   writer1.buffer.Bytes(),
	}
	if err := i.Init(); err == nil {
		store.Add(i)
	}
}

func proxyTransparent(c *gin.Context) {
	config := c.MustGet("config").(*Config)
	proxy := httputil.NewSingleHostReverseProxy(config.Remote)
	proxy.ServeHTTP(c.Writer, c.Request)
}

var (
	_ io.ReadCloser      = requestRecorder{}
	_ gin.ResponseWriter = responseRecorder{}
)

func wrapRequest(req *http.Request) (*http.Request, []byte, error) {
	req1 := req.Clone(req.Context())
	bodyData, err := io.ReadAll(req.Body)
	if err != nil {
		return nil, nil, err
	}
	req1.Body = io.NopCloser(bytes.NewBuffer(bodyData))
	return req1, bodyData, nil
}

func wrapResponseWriter(w gin.ResponseWriter) responseRecorder {
	return responseRecorder{
		w:      w,
		buffer: bytes.NewBuffer(nil),
	}
}

type requestRecorder struct {
	r      io.ReadCloser
	buffer *bytes.Buffer
}

type responseRecorder struct {
	w      gin.ResponseWriter
	buffer *bytes.Buffer
}

func (rr requestRecorder) Read(p []byte) (int, error) {
	n1, err := rr.r.Read(p)
	if err == nil {
		rr.buffer.Write(p[:n1])
	}
	return n1, err
}

func (rr requestRecorder) Close() error {
	return rr.r.Close()
}

func (rr responseRecorder) Header() http.Header {
	return rr.w.Header()
}

func (rr responseRecorder) Write(b []byte) (int, error) {
	rr.buffer.Write(b)
	return rr.w.Write(b)
}

func (rr responseRecorder) WriteHeader(statusCode int) {
	rr.w.WriteHeader(statusCode)
}

func (rr responseRecorder) WriteHeaderNow() {
	rr.w.WriteHeaderNow()
}

func (rr responseRecorder) Status() int {
	return rr.w.Status()
}

func (rr responseRecorder) Size() int {
	return rr.w.Size()
}

func (rr responseRecorder) Written() bool {
	return rr.w.Written()
}

func (rr responseRecorder) WriteString(s string) (int, error) {
	return rr.w.WriteString(s)
}

func (rr responseRecorder) Flush() {
	rr.w.Flush()
}

func (rr responseRecorder) Pusher() http.Pusher {
	return rr.w.Pusher()
}

func (rr responseRecorder) Hijack() (net.Conn, *bufio.ReadWriter, error) {
	return rr.w.Hijack()
}

func (rr responseRecorder) CloseNotify() <-chan bool {
	return rr.w.CloseNotify()
}
