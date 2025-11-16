package main

import (
	"sync"

	"github.com/samber/lo"
)

const maxInvokes = 100

type Store struct {
	mu        sync.RWMutex
	invokes   []*Invoke
	listeners map[string]func(string, *Invoke)
}

func NewStore() *Store {
	return &Store{
		invokes: make([]*Invoke, 0),
	}
}

func (s *Store) AddListener(fn func(string, *Invoke)) string {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.listeners == nil {
		s.listeners = make(map[string]func(string, *Invoke))
	}
	listenerId := lo.RandomString(10, lo.AlphanumericCharset)
	s.listeners[listenerId] = fn
	return listenerId
}

func (s *Store) RemoveListener(id string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.listeners != nil {
		delete(s.listeners, id)
	}
}

func (s *Store) Add(i *Invoke) {
	if i == nil {
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	if len(s.invokes) >= maxInvokes {
		s.invokes = s.invokes[1:]
	}

	s.invokes = append(s.invokes, i)
	for _, fn := range s.listeners {
		fn("add", i)
	}
}

func (s *Store) Count() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.invokes)
}

func (s *Store) All() []*Invoke {
	s.mu.RLock()
	defer s.mu.RUnlock()
	copied := make([]*Invoke, len(s.invokes))
	copy(copied, s.invokes)
	return copied
}

func (s *Store) Tail(n int) []*Invoke {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if n > len(s.invokes) {
		n = len(s.invokes)
	}
	tail := []*Invoke{}
	for j := len(s.invokes) - n; j < len(s.invokes); j++ {
		tail = append(tail, s.invokes[j])
	}
	return tail
}

func (s *Store) Get(id string) *Invoke {
	s.mu.RLock()
	defer s.mu.RUnlock()
	n := len(s.invokes)
	for j := n - 1; j >= 0; j-- {
		i := s.invokes[j]
		if i.ID == id {
			return i
		}
	}
	return nil
}

func (s *Store) Latest() *Invoke {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if len(s.invokes) == 0 {
		return nil
	}
	return s.invokes[len(s.invokes)-1]
}
