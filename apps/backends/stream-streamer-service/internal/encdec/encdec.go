package encdec

import (
	"encoding/base64"
)

const SUFFIX_LENGTH = 16

// StreamKeyEncoding is the unpadded base64 encoding.
// It is used in stream key and url suffixes.
var StreamKeyEncoding = base64.NewEncoding("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$&").WithPadding(base64.NoPadding)
