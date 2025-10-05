package parser

import (
	"regexp"
	"strings"
	"time"
)

var durationPattern = regexp.MustCompile(`(\d+)\s*([HhMmSs])`)

// ParseUnitDuration парсит единицу измерения длительности
func ParseUnitDuration(durationUnit string) time.Duration {
	switch strings.ToUpper(durationUnit) {
	case "H":
		return time.Hour
	case "M":
		return time.Minute
	case "S":
		return time.Second
	}
	return 0
}

// ParseDuration парсит строку длительности в time.Duration
func ParseDuration(duration string, defaultValue time.Duration) time.Duration {
	var result time.Duration = 0
	for _, g := range durationPattern.FindAllStringSubmatch(duration, -1) {
		d := time.Duration(ParseInt(g[1], 1)) * ParseUnitDuration(g[2])
		result += d
	}

	return result
}
