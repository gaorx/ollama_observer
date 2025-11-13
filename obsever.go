package main

import (
	"github.com/gin-gonic/gin"
	"github.com/samber/lo"
)

func apiObserverIds(c *gin.Context) {
	invokes := store.All()
	ids := lo.Map(invokes, func(i *Invoke, _ int) any {
		return i.ID
	})
	c.JSON(200, NewResultOK(ids))
}

func apiObserverAll(c *gin.Context) {
	invokes := store.All()
	responses := lo.Map(invokes, func(i *Invoke, _ int) any {
		return NewInvokeResponse(i)
	})
	c.JSON(200, NewResultOK(responses))
}

func apiObserverGet(c *gin.Context) {
	args := getRequestArgs(c)
	id := getStringArg(args, "id", "")
	if id == "" {
		c.JSON(400, NewResultErr(400, "missing id"))
		return
	}
	i := store.Get(id)
	if i == nil {
		c.JSON(404, NewResultErr(404, "invoke not found"))
		return
	}
	c.JSON(200, NewResultOK(NewInvokeResponse(i)))
}
