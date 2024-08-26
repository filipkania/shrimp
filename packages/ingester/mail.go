package ingester

import (
	"encoding/json"
	"errors"
	"net/mail"
	"strings"
	"time"

	"github.com/jhillyerd/enmime"
	"github.com/lib/pq"
	"github.com/samber/lo"
)

type Mail struct {
	MessageId *string `db:"message_id"`

	TechnicalSender string `db:"technical_sender"`
	From            string `db:"from"`

	TechnicalRcpt string         `db:"technical_rcpt"`
	To            pq.StringArray `db:"to"`
	Ccs           pq.StringArray `db:"ccs"`
	ReplyTo       pq.StringArray `db:"reply_to"`

	Headers string `db:"headers"`

	Subject *string `db:"subject"`
	Text    string  `db:"text"`
	Html    string  `db:"html"`

	ReceivedAt time.Time `db:"received_at"`
}

func getHeader(envelope *enmime.Envelope, key string) *string {
	if lo.Contains(envelope.GetHeaderKeys(), key) {
		value := envelope.GetHeader(key)
		return &value
	} else {
		return nil
	}
}

func ParseMail(sender, recipient string, envelope *enmime.Envelope) (*Mail, error) {
	toAddresses, err := envelope.AddressList("To")
	if err != nil {
		rcpt, err := mail.ParseAddress(recipient)
		if err != nil {
			return nil, errors.New("Recipient field could not be parsed")
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

	ccs, err := envelope.AddressList("Cc")
	if err != nil {
		ccs = []*mail.Address{}
	}

	// according to RFC 5322, Reply-To can have multiple addresses
	replyTos, err := envelope.AddressList("Reply-To")
	if err != nil {
		replyTos = []*mail.Address{}
	}

	return &Mail{
		MessageId: getHeader(envelope, "Message-Id"),

		TechnicalSender: sender,
		From:            lo.FromPtrOr(getHeader(envelope, "From"), sender),

		TechnicalRcpt: recipient,
		To:            lo.Map(toAddresses, func(addr *mail.Address, _ int) string { return addr.String() }),
		Ccs:           lo.Map(ccs, func(addr *mail.Address, _ int) string { return addr.String() }),
		ReplyTo:       lo.Map(replyTos, func(addr *mail.Address, _ int) string { return addr.String() }),

		Headers: headersToJson(envelope),

		Subject: getHeader(envelope, "Subject"),
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
