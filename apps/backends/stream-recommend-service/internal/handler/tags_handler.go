package handler

import (
	"github.com/gofiber/fiber/v2"
)

// GetTags godoc
// @Summary Get all unique stream tags
// @Description Returns list of all unique tags used in live streams
// @Tags tags
// @Produce json
// @Success 200 {array} string "List of tags"
// @Router /tags [get]
func (h *Handler) getAllTags(c *fiber.Ctx) error {
	tags := h.streamService.GetUniqueTags()
	return c.JSON(tags)
}

// // getAllTags возвращает все теги
// // @Summary Получить все теги
// // @Description Возвращает список всех тегов video
// // @Tags tags
// // @Produce json
// // @Success 200 {array} model.Tag
// // @Failure 500 {object} map[string]string
// // @Router /tags [get]
// func (h *Handler) getAllTags(c *fiber.Ctx) error {

// 	var tags []model.Tag

// 	if err := h.db.Find(&tags).Error; err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not fetch tag"})
// 	}

// 	return c.JSON(tags)
// }

// // getTagById возвращает тег по ID
// // @Summary Получить тег по ID
// // @Description Возвращает информацию о конкретном теге
// // @Tags tags
// // @Produce json
// // @Param id path string true "ID тега" Format(uuid)
// // @Success 200 {object} model.Tag
// // @Failure 400 {object} map[string]string
// // @Failure 404 {object} map[string]string
// // @Router /tags/{id} [get]
// func (h *Handler) getTagById(c *fiber.Ctx) error {

// 	id, err := uuid.Parse(c.Params("id"))
// 	if err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID format"})
// 	}

// 	var tag model.Tag
// 	result := h.db.First(&tag, "id = ?", id)
// 	if result.Error != nil {
// 		if result.Error == gorm.ErrRecordNotFound {
// 			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Tag not found"})
// 		}
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
// 	}

// 	return c.JSON(tag)
// }

// // createTag создает новый тег
// // @Summary Создать новый тег
// // @Description Добавляет новый тег video в систему
// // @Tags tags
// // @Accept json
// // @Produce json
// // @Param input body types.CreateTagRequest true "Данные тега"
// // @Security ApiKeyAuth
// // @Success 201 {object} model.Category
// // @Failure 400 {object} map[string]string
// // @Failure 500 {object} map[string]string
// // @Router /tags [post]
// func (h *Handler) createTag(c *fiber.Ctx) error {
// 	var req types.CreateTagRequest
// 	if err := c.BodyParser(&req); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
// 	}

// 	tag := model.Tag{
// 		Name: req.Name,
// 	}

// 	if err := h.db.Create(&tag).Error; err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create tag"})
// 	}

// 	return c.Status(fiber.StatusCreated).JSON(tag)
// }
