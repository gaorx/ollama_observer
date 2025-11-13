package main

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func toTimestamp(t time.Time) int64 {
	return t.UnixNano() / int64(time.Millisecond)
}

func fromTimestamp(ts int64) time.Time {
	return time.Unix(0, ts*int64(time.Millisecond))
}

func httpHeaderToMap(header map[string][]string) map[string]string {
	result := make(map[string]string)
	for k, v := range header {
		if len(v) > 0 {
			result[k] = v[0]
		} else {
			result[k] = ""
		}
	}
	return result
}

func getRequestArgs(c *gin.Context) map[string]any {
	args := map[string]any{}

	readQueryToArgs := func() {
		for k, v := range c.Request.URL.Query() {
			if len(v) > 0 {
				args[k] = v[0]
			} else {
				args[k] = ""
			}
		}
	}

	if c.Request.Method == "GET" {
		readQueryToArgs()
	} else if c.Request.Method == "POST" {
		var bodyArgs map[string]any
		if err := c.BindJSON(&bodyArgs); err == nil {
			for k, v := range bodyArgs {
				args[k] = v
			}
		}
		readQueryToArgs()
	}
	fmt.Println("******", args)
	return args
}

func getStringArg(args map[string]any, key string, defaultValue string) string {
	if v, ok := args[key]; ok {
		if s, ok := v.(string); ok {
			return s
		}
	}
	return defaultValue
}
