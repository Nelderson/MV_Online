# Changelog

## v1.3.8 2015-12-29

  * Do not use strict isEmail function, just check that there are no newlines in addresses. Fixes a regression with lax e-mail addresses.

## v1.3.7 2015-12-22

  * Fixed an issue with Node v0.10 where too many events were cleared

## v1.3.6 2015-12-19

  * Updated isemail configuration to only allow SMTP compatible e-mail addresses for the envelope (otherwise valid addresses might include symbols that don't play well with SMTP, eg. line folding inside quoted strings)

## v1.3.5 2015-12-19

  * Validate to and from address to be valid e-mail addresses

## v1.3.2 2015-12-16

  * Added missing 'close' and 'end' event handlers for a STARTTLS-upgraded socket

## v1.3.1 2015-06-30

  * Added partial support for LMTP protocol. Works only with single recipient (does not support multiple responses for DATA command)

## v1.2.0 2015-03-09

  * Connection object has a new property `secure` that indicates if the current connection is using a secure TLS socket or not
  * Fixed `requireTLS` where the connection was established insecurely if STARTTLS failed, now it returns an error as it should if STARTTLS fails

## v1.1.0 2014-11-11

  * Added additional constructor option `requireTLS` to ensure that the connection is upgraded before any credentials are passed to the server
  * Added additional constructor option `socket` to use an existing socket instead of creating new one (bantu)

## v1.0.2 2014-10-15

  * Removed CleartextStream.pair.encrypted error handler. Does not seem to be supported by Node v0.11

## v1.0.1 2014-10-15

  * Added 'error' handler for CleartextStream.pair.encrypted object when connecting to TLS.

## v1.0.0 2014-09-26

  * Changed version scheme from 0.x to 1.x.
  * Improved error handling for timeout on creating a connection. Caused issues with `once('error')` handler as an error might have been emitted twice
