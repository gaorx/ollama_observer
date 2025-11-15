package main

import (
	"embed"
	"strings"

	"github.com/gin-gonic/gin"
)

//go:embed ui/dist/*
var distRootFS embed.FS

func observerUI(c *gin.Context) {
	path := strings.TrimPrefix(c.Param("any"), "/o")
	if path == "" || path == "/" {
		path = "/index.html"
	}
	d, err := distRootFS.ReadFile("ui/dist" + path)
	if err != nil {
		c.String(404, "Not Found")
		return
	}
	mimeType := getMimeFromFilename(path)
	c.Data(200, mimeType, d)
}
