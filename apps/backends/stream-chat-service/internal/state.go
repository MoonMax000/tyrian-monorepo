package internal

import (
	"bytes"
	"encoding/gob"
	"os"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

type State struct {
	Mutes   map[uuid.UUID]time.Time
	Submode bool
	sync.RWMutex
}

var (
	StateMut = &State{
		Mutes: make(map[uuid.UUID]time.Time),
	}
)

func (s *State) Load() {
	s.Lock()
	defer s.Unlock()

	b, err := os.ReadFile("state.dc")
	if err != nil {
		log.Error().Msgf("[load] Error while reading from states file '%s'", err)
		return
	}
	mb := bytes.NewBuffer(b)
	dec := gob.NewDecoder(mb)
	err = dec.Decode(&s.Mutes)
	if err != nil {
		log.Error().Msgf("[load] Error decoding mutes from states file '%s'", err)
	}
	err = dec.Decode(&s.Submode)
	if err != nil {
		log.Error().Msgf("[load] Error decoding submode from states file '%s'", err)
	}
}

// expects to be called with locks held
func (s *State) Save() {
	mb := new(bytes.Buffer)
	enc := gob.NewEncoder(mb)
	err := enc.Encode(&s.Mutes)
	if err != nil {
		log.Error().Msgf("[load] Error encoding mutes '%s'", err)
	}
	err = enc.Encode(&s.Submode)
	if err != nil {
		log.Error().Msgf("[load] Error encoding submode '%s'", err)
	}

	err = os.WriteFile("state.dc", mb.Bytes(), 0600)
	if err != nil {
		log.Error().Msgf("[load] Error with writing out state file '%s'", err)
	}
}
