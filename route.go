package main

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/samber/lo"
)

func route(c *gin.Context) {
	reqPath := c.Param("any")
	if reqPath == "/api/observer/all" {
		apiObserverAll(c)
		return
	} else if reqPath == "/api/observer/ids" {
		apiObserverIds(c)
		return
	} else if reqPath == "/api/observer/get" {
		apiObserverGet(c)
		return
	} else if reqPath == "/api/observer/clear" {
		apiObserverClear(c)
		return
	} else if reqPath == "/api/observer/pull" {
		apiObserverPull(c)
		return
	} else if reqPath == "/o" || strings.HasPrefix(reqPath, "/o/") {
		observerUI(c)
		return
	} else if lo.Contains(recordableAPIs, reqPath) {
		proxyRecordable(c)
		return
	} else {
		proxyTransparent(c)
		return
	}
}
