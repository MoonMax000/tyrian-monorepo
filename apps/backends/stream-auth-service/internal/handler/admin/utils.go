package admin

import (
	"net/mail"
	"strings"
)

type SortDirection string

const (
	SortDirectionUnsorted SortDirection = ""
	SortDirectionAsc      SortDirection = "ASC"
	SortDirectionDesc     SortDirection = "DESC"
)

type SortByField struct {
	FieldName     string
	SortDirection SortDirection
}

func parseSortString(queryParam string) []SortByField {
	result := make([]SortByField, 0, 10)
	for _, sortByField := range strings.Split(queryParam, ",") {
		if len(sortByField) == 0 {
			continue
		}
		sortDirection := SortDirectionUnsorted
		if sortByField[0] == "+"[0] {
			sortDirection = SortDirectionAsc
		}
		if sortByField[0] == "-"[0] {
			sortDirection = SortDirectionDesc
		}
		result = append(result, SortByField{
			FieldName:     sortByField[1:],
			SortDirection: sortDirection,
		})
	}
	return result
}

func validateEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func RemoveDuplicateStrings(stringsList ...string) []string {
	uniqueMap := make(map[string]bool) // Map to track seen strings
	var uniqueStrings []string         // Slice to store unique strings

	for _, item := range stringsList {
		if _, exists := uniqueMap[item]; !exists { // Check if string already exists in map
			uniqueMap[item] = true                      // Mark as seen
			uniqueStrings = append(uniqueStrings, item) // Add to unique slice
		}
	}
	return uniqueStrings
}
