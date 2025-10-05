package slice

// Contains проверяет наличие элемента в слайсе
func Contains[T comparable](slice []T, element T) bool {
	for _, v := range slice {
		if v == element {
			return true
		}
	}
	return false
}

// Mapping преобразует слайс одного типа в слайс другого типа
func Mapping[T1 any, T2 any](slice []T1, mapperFunction func(T1) T2) []T2 {
	result := make([]T2, len(slice))
	for i, e := range slice {
		result[i] = mapperFunction(e)
	}
	return result
}

// MappingToMap преобразует слайс в map
func MappingToMap[T1 any, T2 comparable, T3 any](slice []T1, mapperFunction func(T1) (T2, T3)) map[T2]T3 {
	result := make(map[T2]T3, len(slice))
	for _, e := range slice {
		key, value := mapperFunction(e)
		result[key] = value
	}
	return result
}

// MappingToMultiMap преобразует слайс в multimap
func MappingToMultiMap[T1 any, T2 comparable, T3 any](slice []T1, mapperFunction func(T1) (T2, T3)) map[T2][]T3 {
	result := make(map[T2][]T3, len(slice))
	for _, e := range slice {
		key, value := mapperFunction(e)
		values, ok := result[key]
		if !ok {
			values = make([]T3, 0, 4)
		}
		values = append(values, value)
		result[key] = values
	}
	return result
}

// Remove удаляет элемент из слайса
func Remove[T comparable](slice []T, element T) []T {
	for i, v := range slice {
		if v == element {
			return append(slice[:i], slice[i+1:]...)
		}
	}
	return slice
}

// RemoveFunc удаляет элемент из слайса по условию
func RemoveFunc[T any](slice []T, elementSelector func(T) bool) []T {
	for i, v := range slice {
		if elementSelector(v) {
			return append(slice[:i], slice[i+1:]...)
		}
	}
	return slice
}

// Any возвращает первый элемент, удовлетворяющий условию
func Any[T comparable](slice []T, predicate func(T) bool) T {
	var result T
	for _, v := range slice {
		if predicate(v) {
			return v
		}
	}
	return result
}

// Last возвращает последний элемент слайса
func Last[T any](slice []T) T {
	var result T
	if len(slice) > 0 {
		return slice[len(slice)-1]
	}
	return result
}
