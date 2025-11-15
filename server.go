package main

import (
	"context"
	"fmt"
	"net/url"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/urfave/cli/v3"
)

const defaultRemote = "http://localhost:11434"

type Config struct {
	Port   int
	Remote *url.URL
}

func NewServerCmd() *cli.Command {
	return &cli.Command{
		Usage: "Run ollama proxy server",
		Flags: []cli.Flag{
			&cli.IntFlag{
				Name:    "port",
				Aliases: []string{"p"},
				Value:   11435,
				Usage:   "port for the proxy server",
			},
			&cli.StringFlag{
				Name:    "remote",
				Aliases: []string{"r"},
				Value:   defaultRemote,
				Usage:   "remote ollama server address",
			},
		},
		Action: func(ctx context.Context, cmd *cli.Command) error {
			return serverMain(ctx, cmd)
		},
	}
}

func serverMain(_ context.Context, cmd *cli.Command) error {
	config, err := parseConfig(cmd)
	if err != nil {
		return err
	}
	gin.SetMode(gin.ReleaseMode)
	app := gin.New()
	app.Use(gin.Recovery())
	app.Use(func(c *gin.Context) {
		c.Set("config", config)
	})
	// Proxy all other requests
	app.GET("/*any", route)
	app.POST("/*any", route)
	app.PUT("/*any", route)
	app.DELETE("/*any", route)
	app.PATCH("/*any", route)
	app.HEAD("/*any", route)
	app.OPTIONS("/*any", route)
	fmt.Printf("Ollama proxy server is running on %d, remote is %s\n", config.Port, config.Remote)
	return app.Run(fmt.Sprintf(":%d", config.Port))
}

func parseConfig(cmd *cli.Command) (*Config, error) {
	port := cmd.Int("port")
	if port <= 0 || port > 65535 {
		return nil, fmt.Errorf("invalid port number: %d", port)
	}
	remote, err := parseRemote(cmd.String("remote"))
	if err != nil {
		return nil, err
	}
	return &Config{
		Port:   port,
		Remote: remote,
	}, nil
}

func parseRemote(addr string) (*url.URL, error) {
	isUrl := func(s string) bool {
		_, err := url.Parse(s)
		return err == nil
	}

	addr = strings.TrimSpace(addr)
	if addr == "" {
		addr = defaultRemote
	} else if port, err := strconv.Atoi(addr); err == nil {
		addr = fmt.Sprintf("http://localhost:%d", port)
	} else if strings.HasPrefix(addr, "http://") || strings.HasPrefix(addr, "https://") {
	} else if strings.Contains(addr, ":") {
		addr = "http://" + addr
	} else {
		addr = fmt.Sprintf("http://%s:11434", addr)
	}
	if !isUrl(addr) {
		return nil, fmt.Errorf("invalid remote address: %s", addr)
	}
	return url.Parse(addr)
}
