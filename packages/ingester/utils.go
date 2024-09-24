package ingester

import (
	"crypto/rand"
	"fmt"
)

func randomString(length int) string {
	b := make([]byte, length)
	rand.Read(b)
	return fmt.Sprintf("%x", b)[:length]
}
