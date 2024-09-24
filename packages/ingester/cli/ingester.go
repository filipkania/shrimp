package main

import (
	"os"

	"github.com/filipkania/shrimp/packages/ingester"
)

func main() {
	cfg := ingester.IngesterConfig{
		DATABASE_URL: os.Getenv("DATABASE_URL"),
		DEBUG:        os.Getenv("DEBUG") == "1",
	}

	ingester.Run(&cfg)
}
