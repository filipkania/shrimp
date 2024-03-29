package main

import (
	"flag"
	"io"
	"log"

	"github.com/emersion/go-smtp"
	"github.com/jhillyerd/enmime"
)

var addr = "0.0.0.0:8047"

func init() {
	flag.StringVar(&addr, "l", addr, "Listen address")
}

type backend struct{}

func (bkd *backend) NewSession(c *smtp.Conn) (smtp.Session, error) {
	return &session{}, nil
}

type session struct{}

func (s *session) AuthPlain(username, password string) error {
	return nil
}

func (s *session) Mail(from string, opts *smtp.MailOptions) error {
	return nil
}

func (s *session) Rcpt(to string, opts *smtp.RcptOptions) error {
	return nil
}

func (s *session) Data(r io.Reader) error {
	env, err := enmime.ReadEnvelope(r)
	if err != nil {
		return err
	}

	for _, att := range env.Attachments {
		log.Println(att.FileName, len(att.Content))
	}
	return nil
}

func (s *session) Reset() {}

func (s *session) Logout() error {
	return nil
}

func main() {
	flag.Parse()

	s := smtp.NewServer(&backend{})

	s.Addr = addr
	// s.Domain = "localhost"
	s.LMTP = true
	s.Network = "tcp"
	// s.Debug = os.Stdout

	log.Println("Starting LMTP server at", addr)
	log.Fatal(s.ListenAndServe())
}
