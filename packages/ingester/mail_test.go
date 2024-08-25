package ingester_test

import (
	"os"
	"testing"

	"github.com/filipkania/shrimp/packages/ingester"
	"github.com/jhillyerd/enmime"
	"github.com/stretchr/testify/assert"
)

func TestParser(t *testing.T) {
	f, err := os.Open("./tests/example_mail.eml")
	if err != nil {
		t.Fatal("Can't open example_mail.eml")
	}

	mail, _ := enmime.ReadEnvelope(f)
	msg, err := ingester.ParseMail("a@a.com", "b@b.com", mail)
	if err != nil {
		t.Fatalf("ingester.ParseMail() returned error: %v\n", err.Error())
	}

	assert.Equal(t, msg.To[0], "<admin@localhost>")
	assert.Equal(t, msg.TechnicalSender, "a@a.com")

	assert.Equal(t, msg.From, "sender@example.com")
	assert.Equal(t, msg.MessageId, "")

	assert.Equal(t, msg.Html, "<h1>Hello!</h1>\n<p>This is a test email.</p>\n")
	assert.NotEqual(t, msg.Text, "")
}
