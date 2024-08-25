package ingester

import (
	"os"

	"github.com/emersion/go-smtp"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	log "github.com/sirupsen/logrus"
)

func Run(cfg *IngesterConfig) {
	log.Println("Starting the ingester...")

	pool, err := sqlx.Connect("postgres", cfg.DATABASE_URL)
	if err != nil {
		log.Fatalln("Unable to connect to database:", err)
	}
	defer pool.Close()

	s := smtp.NewServer(&LmtpBackend{
		pool: pool,
	})

	if cfg.DEBUG {
		s.Debug = os.Stdout
		log.SetLevel(log.DebugLevel)
	}

	s.Addr = "0.0.0.0:8047"
	s.Network = "tcp"
	s.LMTP = true
	s.Domain = "ingester"

	log.Printf("Listening on %s...", s.Addr)
	log.Fatal(s.ListenAndServe())
}
