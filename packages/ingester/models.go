package ingester

import (
	"encoding/json"
	"net/mail"
	"strings"
	"time"

	"github.com/jhillyerd/enmime"
	"github.com/lib/pq"
	"github.com/samber/lo"
)

type Mail struct {
	MessageId string `db:"message_id"`

	TechnicalSender string `db:"technical_sender"`
	From            string `db:"from"`

	To      pq.StringArray `db:"to"`
	Ccs     pq.StringArray `db:"ccs"`
	ReplyTo string         `db:"reply_to"`

	Headers string `db:"headers"`

	Subject string `db:"subject"`
	Text    string `db:"text"`
	Html    string `db:"html"`

	ReceivedAt time.Time `db:"received_at"`
}

func ParseMail(sender, recipient string, envelope *enmime.Envelope) (*Mail, error) {
	toAddresses, err := envelope.AddressList("To")
	if err != nil {
		rcpt, err := mail.ParseAddress(recipient)
		if err != nil {
			return nil, &ParseError{
				msg: "Recipient field could not be parsed",
			}
		}

		toAddresses = []*mail.Address{
			rcpt,
		}
	}

	recvHeader := strings.Split(envelope.GetHeader("Received"), "; ")[1]
	received_at, err := time.Parse(time.RFC1123Z, recvHeader)
	if err != nil {
		received_at = time.Now()
	}

	return &Mail{
		MessageId: envelope.GetHeader("Message-Id"),

		TechnicalSender: sender,
		From:            envelope.GetHeader("From"),

		To: lo.Map(toAddresses, func(addr *mail.Address, _ int) string { return addr.String() }),
		// TODO: implement Ccs & ReplyTos
		Ccs:     []string{},
		ReplyTo: "",

		Headers: headersToJson(envelope),

		Subject: envelope.GetHeader("Subject"),
		Text:    envelope.Text,
		Html:    envelope.HTML,

		ReceivedAt: received_at,
	}, nil
}

func headersToJson(envelope *enmime.Envelope) string {
	headers := map[string]string{}
	for _, key := range envelope.GetHeaderKeys() {
		headers[key] = envelope.GetHeader(key)
	}

	json, _ := json.Marshal(headers)
	return string(json)
}

type ParseError struct {
	msg string
}

func (p *ParseError) Error() string {
	return p.msg
}
