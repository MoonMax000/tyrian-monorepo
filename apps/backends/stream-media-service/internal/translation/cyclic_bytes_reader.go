package translation

import (
	"errors"
	"io"
	"math"
	"unicode/utf8"
)

// A CyclicBytesReader implements the [io.Reader], [io.ReaderAt], [io.WriterTo], [io.Seeker],
// [io.ByteScanner], and [io.RuneScanner] interfaces by reading from
// a byte slice.
// Unlike a [Buffer], a Reader is read-only and supports seeking.
// The zero value for Reader operates like a Reader of an empty slice.
type CyclicBytesReader struct {
	bytes    []byte
	pos      int64 // current reading index
	prevRune int   // index of previous rune; or < 0
}

// Len returns the number of bytes of the unread portion of the
// slice.
func (reader *CyclicBytesReader) Len() int {
	return math.MaxInt
}

// Size returns the original length of the underlying byte slice.
// Size is the number of bytes available for reading via [Reader.ReadAt].
// The result is unaffected by any method calls except [Reader.Reset].
func (reader *CyclicBytesReader) Size() int64 { return int64(len(reader.bytes)) }

// Read implements the [io.Reader] interface.
func (reader *CyclicBytesReader) Read(b []byte) (n int, err error) {
	if reader.pos >= int64(len(reader.bytes)) {
		return 0, io.EOF
	}
	reader.prevRune = -1
	n = copy(b, reader.bytes[reader.pos:])
	reader.pos += int64(n)
	return
}

// ReadAt implements the [io.ReaderAt] interface.
func (reader *CyclicBytesReader) ReadAt(b []byte, off int64) (n int, err error) {
	// cannot modify state - see io.ReaderAt
	if off < 0 {
		return 0, errors.New("bytes.CyclicBytesReader.ReadAt: negative offset")
	}
	if off >= int64(len(reader.bytes)) {
		return 0, io.EOF
	}
	n = copy(b, reader.bytes[off:])
	if n < len(b) {
		err = io.EOF
	}
	return
}

// ReadByte implements the [io.ByteReader] interface.
func (reader *CyclicBytesReader) ReadByte() (byte, error) {
	reader.prevRune = -1
	if reader.pos >= int64(len(reader.bytes)) {
		return 0, io.EOF
	}
	b := reader.bytes[reader.pos]
	reader.pos++
	return b, nil
}

// UnreadByte complements [Reader.ReadByte] in implementing the [io.ByteScanner] interface.
func (reader *CyclicBytesReader) UnreadByte() error {
	if reader.pos <= 0 {
		return errors.New("bytes.CyclicBytesReader.UnreadByte: at beginning of slice")
	}
	reader.prevRune = -1
	reader.pos--
	return nil
}

// ReadRune implements the [io.RuneReader] interface.
func (reader *CyclicBytesReader) ReadRune() (ch rune, size int, err error) {
	if reader.pos >= int64(len(reader.bytes)) {
		reader.prevRune = -1
		return 0, 0, io.EOF
	}
	reader.prevRune = int(reader.pos)
	if c := reader.bytes[reader.pos]; c < utf8.RuneSelf {
		reader.pos++
		return rune(c), 1, nil
	}
	ch, size = utf8.DecodeRune(reader.bytes[reader.pos:])
	reader.pos += int64(size)
	return
}

// UnreadRune complements [Reader.ReadRune] in implementing the [io.RuneScanner] interface.
func (reader *CyclicBytesReader) UnreadRune() error {
	if reader.pos <= 0 {
		return errors.New("bytes.CyclicBytesReader.UnreadRune: at beginning of slice")
	}
	if reader.prevRune < 0 {
		return errors.New("bytes.CyclicBytesReader.UnreadRune: previous operation was not ReadRune")
	}
	reader.pos = int64(reader.prevRune)
	reader.prevRune = -1
	return nil
}

// Seek implements the [io.Seeker] interface.
func (reader *CyclicBytesReader) Seek(offset int64, whence int) (int64, error) {
	reader.prevRune = -1
	var abs int64
	switch whence {
	case io.SeekStart:
		abs = offset
	case io.SeekCurrent:
		abs = reader.pos + offset
	case io.SeekEnd:
		abs = int64(len(reader.bytes)) + offset
	default:
		return 0, errors.New("bytes.CyclicBytesReader.Seek: invalid whence")
	}
	if abs < 0 {
		return 0, errors.New("bytes.CyclicBytesReader.Seek: negative position")
	}
	reader.pos = abs
	return abs, nil
}

// WriteTo implements the [io.WriterTo] interface.
func (reader *CyclicBytesReader) WriteTo(w io.Writer) (n int64, err error) {
	reader.prevRune = -1
	if reader.pos >= int64(len(reader.bytes)) {
		return 0, nil
	}
	b := reader.bytes[reader.pos:]
	m, err := w.Write(b)
	if m > len(b) {
		panic("bytes.CyclicBytesReader.WriteTo: invalid Write count")
	}
	reader.pos += int64(m)
	n = int64(m)
	if m != len(b) && err == nil {
		err = io.ErrShortWrite
	}
	return
}

// Reset resets the [Reader] to be reading from b.
func (reader *CyclicBytesReader) Reset(b []byte) { *reader = CyclicBytesReader{b, 0, -1} }

// NewCyclicBytesReader returns a new [Reader] reading from b.
func NewCyclicBytesReader(b []byte) *CyclicBytesReader { return &CyclicBytesReader{b, 0, -1} }
