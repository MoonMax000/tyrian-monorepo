package internal


func ExistPermit(permitsList []string, permit string) bool {
	for _, x := range permitsList {
		if x == permit {
			return true
		}
	}

	return false
}

func StringInSlice(a string, list []string) bool {
	for _, b := range list {
		if b == a {
			return true
		}
	}
	return false
}
