package ingester

import (
	"io"

	"github.com/emersion/go-smtp"
	"github.com/jhillyerd/enmime"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

type LmtpBackend struct {
	pool *sqlx.DB
}

func (b *LmtpBackend) NewSession(c *smtp.Conn) (smtp.Session, error) {
	return &LmtpSession{
		pool: b.pool,
		log:  log.NewEntry(log.New()),
	}, nil
}

type LmtpSession struct {
	pool *sqlx.DB
	log  *log.Entry

	from string
	to   string
}

func (s *LmtpSession) Data(r io.Reader) error {
	// TODO: upload .eml file to some object storage?
	envelope, err := enmime.ReadEnvelope(r)
	if err != nil {
		return &smtp.SMTPError{
			Code:    500,
			Message: "Error occured while parsing this message",
		}
	}

	parsedMail, err := ParseMail(s.from, s.to, envelope)
	if err != nil {
		return &smtp.SMTPError{
			Code:    501,
			Message: err.Error(),
		}
	}

	s.log.Debugf("Data(): %+v\n", parsedMail)

	_, err = s.pool.NamedExec(`
		INSERT INTO mails(
			message_id, technical_sender, "from",
			technical_rcpt, "to", ccs,
			reply_to, headers, subject,
			text, html, received_at
		)
		VALUES (
			:message_id, :technical_sender, :from,
			:technical_rcpt, :to, :ccs,
			:reply_to, :headers, :subject,
			:text, :html, :received_at
		);
	`, parsedMail)
	if err != nil {
		s.log.Errorf("Error while inserting mail to database: %v\n", err)

		return &smtp.SMTPError{
			Code:    451,
			Message: "Error while receiving email. Please try again later.",
		}
	}

	return nil
}

func (s *LmtpSession) Logout() error {
	s.log.Printf("Logout()")

	return nil
}

func (s *LmtpSession) Mail(from string, opts *smtp.MailOptions) error {
	// unfortunately, opts.EnvelopeID is empty string :/
	s.log = log.WithFields(log.Fields{
		"envelope_id": randomString(8),
	})

	s.from = from
	s.log.Printf("Mail(): from: %s", from)

	return nil
}

func (s *LmtpSession) Rcpt(to string, opts *smtp.RcptOptions) error {
	s.log.Printf("Rcpt(): to: %s", to)
	s.to = to

	return nil
}

func (s *LmtpSession) Reset() {
	s.log.Printf("Reset()")

	s.from = ""
	s.to = ""
}
