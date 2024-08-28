import smtplib
from email.mime.text import MIMEText

# remember to disable all checks in maddy.conf (spf, dkim, require_mx_record...)
# while using this test utility.

content = """
<h1>Hello!</h1>
<p>This is a test email.</p>
""".strip()

with smtplib.SMTP("localhost", 25) as s:
  msg = MIMEText(content, "html")

  msg["Subject"] = "Test Email"
  msg["From"] = "sender@example.com"
  msg["To"] = "admin@localhost"

  msg["X-Example-Header"] = "hello!"
  print(msg)

  s.sendmail("sender@example.com", "postmaster@localhost", msg.as_string())

print("Email sent.")
