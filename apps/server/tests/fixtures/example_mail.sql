INSERT INTO mails(
  id,
  message_id,
  technical_sender,
  "from",
  technical_rcpt,
  "to",
  ccs,
  reply_to,
  headers,
  subject,
  "text",
  html,
  received_at,
  created_at
) VALUES (
  '004d92b3-1a32-46e9-9219-786a1bca3ae8',
  '<asdf-id@example.com>',
  'hello@example.com',
  'Hello World <hello@example.com>',

  'somebody@shrimp.email',
  '{"Somebody <somebody@shrimp.email>"}',

  '{}',
  '{}',

  '{"Date":"Mon, 26 Aug 2024 08:56:37 -0700","From":"Hello World <hello@example.com>","Received":"from mars.local ([127.0.0.1]) by inbound.shrimp.email (envelope-sender hello@example.com) with ESMTP id 8d1661c1; Mon, 26 Aug 2024 15:56:38 +0000","Subject":"Hello!","To":"somebody@shrimp.email"}',

  'Hello!',
  'Hi there!\r\nsup?',
  NULL,

  '2024-08-26T15:56:38Z',
  '2024-08-26T15:56:38.66196Z'
);
