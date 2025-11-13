package main

import (
	"context"
	"os"
)

var store = NewStore()

func main() {
	NewServerCmd().Run(context.Background(), os.Args)
}
