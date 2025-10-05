package types

type ListedRoleRequestInfo struct {
	RoleRequestInfo

	CollectionId   string `json:"collectionId"`
	CollectionName string `json:"collectionName"`
}

type RoleRequestInfo struct {
	Id      string `json:"id"`
	UserId  string `json:"user_id"`
	Email   string `json:"email"`
	Role    string `json:"role"`
	Comment string `json:"сomment"`
	Status  string `json:"status"`
}

type UpdateRoleRequest struct {
	Status string `json:"status"`
}

type RoleRequestListResponse struct {
	Status     string                  `json:"status"`
	Items      []ListedRoleRequestInfo `json:"items"`
	Page       int                     `json:"page"`
	PerPage    int                     `json:"perPage"`
	TotalItems int                     `json:"totalItems"`
	TotalPages int                     `json:"totalPages"`
}
