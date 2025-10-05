package handler

import (
	"github.com/Capstane/stream-recommend-service/internal/model"
	"github.com/gofiber/fiber/v2"
)

// getAllCategories возвращает все категории
// @Summary Получить все категории
// @Description Возвращает список всех категорий video (замоканные данные)
// @Tags categories
// @Produce json
// @Success 200 {array} model.Category
// @Failure 500 {object} map[string]string
// @Router /categories [get]
func (h *Handler) getAllCategories(c *fiber.Ctx) error {
	// Замоканные категории
	categories := []model.Category{
		{Name: "Crypto"},
		{Name: "Stock Market"},
		{Name: "Meme Coins"},
		{Name: "Technical Analysis"},
		{Name: "Futures & Options"},
		{Name: "News & Reports"},
		{Name: "Robots & Algo"},
	}

	return c.JSON(categories)
}

// // createCategory создает новую категорию
// // @Summary Создать новую категорию
// // @Description Добавляет новую категорию video в систему
// // @Tags categories
// // @Accept json
// // @Produce json
// // @Param input body types.CreateCategoryRequest true "Данные категории"
// // @Security ApiKeyAuth
// // @Success 201 {object} model.Category
// // @Failure 400 {object} map[string]string
// // @Failure 500 {object} map[string]string
// // @Router /categories [post]
// func (h *Handler) createCategory(c *fiber.Ctx) error {
// 	var req types.CreateCategoryRequest
// 	if err := c.BodyParser(&req); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
// 	}

// 	// if err := validate.Struct(req); err != nil {
// 	// 	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
// 	// }

// 	category := model.Category{
// 		Name:        req.Name,
// 		Description: req.Description,
// 		AvatarURL:   req.AvatarURL,
// 	}

// 	if err := h.db.Create(&category).Error; err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create category"})
// 	}

// 	return c.Status(fiber.StatusCreated).JSON(category)
// }

// // getCategoryById возвращает категорию по ID
// // @Summary Получить категорию по ID
// // @Description Возвращает информацию о конкретной категории
// // @Tags categories
// // @Produce json
// // @Param id path string true "ID категории" Format(uuid)
// // @Success 200 {object} model.Category
// // @Failure 400 {object} map[string]string
// // @Failure 404 {object} map[string]string
// // @Router /categories/{id} [get]
// func (h *Handler) getCategoryById(c *fiber.Ctx) error {

// 	id, err := uuid.Parse(c.Params("id"))
// 	if err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID format"})
// 	}

// 	var category model.Category
// 	result := h.db.First(&category, "id = ?", id)
// 	if result.Error != nil {
// 		if result.Error == gorm.ErrRecordNotFound {
// 			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Category not found"})
// 		}
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
// 	}

// 	return c.JSON(category)
// }

// // updateCategory обновляет существующую категорию
// // @Summary Обновить категорию
// // @Description Обновляет информацию о существующей категории
// // @Tags categories
// // @Accept json
// // @Produce json
// // @Param id path string true "ID категории" Format(uuid)
// // @Param input body types.UpdateCategoryRequest true "Обновленные данные"
// // @Security ApiKeyAuth
// // @Success 200 {object} model.Category
// // @Failure 400 {object} map[string]string
// // @Failure 404 {object} map[string]string
// // @Failure 500 {object} map[string]string
// // @Router /categories/{id} [put]
// func (h *Handler) updateCategory(c *fiber.Ctx) error {
// 	claims := c.Locals("claims").(*typex.SessionClaims)
// 	if !slices.Contains(claims.Roles, "admin") {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "not enough rights"})
// 	}

// 	id, err := uuid.Parse(c.Params("id"))
// 	if err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID format"})
// 	}

// 	var req types.UpdateCategoryRequest
// 	if err := c.BodyParser(&req); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
// 	}

// 	// if err := validate.Struct(req); err != nil {
// 	// 	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
// 	// }

// 	var category model.Category
// 	result := h.db.First(&category, "id = ?", id)
// 	if result.Error != nil {
// 		if result.Error == gorm.ErrRecordNotFound {
// 			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Category not found"})
// 		}
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
// 	}

// 	updates := make(map[string]interface{})
// 	if req.Name != "" {
// 		updates["name"] = req.Name
// 	}
// 	if req.Description != "" {
// 		updates["description"] = req.Description
// 	}
// 	if req.AvatarURL != "" {
// 		updates["avatar_url"] = req.AvatarURL
// 	}

// 	if err := h.db.Model(&category).Updates(updates).Error; err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update category"})
// 	}

// 	return c.JSON(category)
// }

// // assignCategory присваивает категорию каналу пользователя
// // @Summary Присвоить категорию
// // @Description Добавляет категориб каналу
// // @Tags categories
// // @Accept json
// // @Produce json
// // @Param id path string true "ID категории" Format(uuid)
// // @Param channel_id path string true "ID канала (ID пользователя)" Format(uuid)
// // @Security ApiKeyAuth
// // @Success 200 {object} model.Category
// // @Failure 400 {object} map[string]string
// // @Failure 404 {object} map[string]string
// // @Failure 500 {object} map[string]string
// // @Router /categories/{id}/{channel_id} [put]
// func (h *Handler) assignCategory(c *fiber.Ctx) error {
// 	claims := c.Locals("claims").(*typex.SessionClaims)
// 	if !slices.Contains(claims.Roles, "admin") {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "not enough rights"})
// 	}

// 	id, err := uuid.Parse(c.Params("id"))
// 	if err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid ID format"})
// 	}

// 	channelId, err := uuid.Parse(c.Params("channel_id"))
// 	if err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid Channel ID format"})
// 	}

// 	var channelCategory model.ChannelCategory
// 	result := h.db.First(&channelCategory, "category_id = ? and channel_id = ?", id, channelId)
// 	if result.Error != nil {
// 		if result.Error == gorm.ErrRecordNotFound {
// 			channelCategory.CategoryId = id
// 			channelCategory.ChannelId = channelId
// 			err := h.db.Save(&channelCategory).Error
// 			if err != nil {
// 				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": fmt.Sprintf("Save channel category error %v", err)})
// 			}
// 			return c.JSON(channelCategory)
// 		}
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": fmt.Sprintf("Database error %v", result.Error)})
// 	}

// 	return c.JSON(channelCategory)
// }

// // assignCategory отзывает категорию от канала пользователя
// // @Summary Отозвать категорию
// // @Description Удаляет категориб у канала
// // @Tags categories
// // @Accept json
// // @Produce json
// // @Param id path string true "ID категории" Format(uuid)
// // @Param channel_id path string true "ID канала (ID пользователя)" Format(uuid)
// // @Security ApiKeyAuth
// // @Success 200 {object} model.Category
// // @Failure 400 {object} map[string]string
// // @Failure 404 {object} map[string]string
// // @Failure 500 {object} map[string]string
// // @Router /categories/{id}/{channel_id} [delete]
// func (h *Handler) unassignCategory(c *fiber.Ctx) error {
// 	claims := c.Locals("claims").(*typex.SessionClaims)
// 	if !slices.Contains(claims.Roles, "admin") {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "not enough rights"})
// 	}

// 	id, err := uuid.Parse(c.Params("id"))
// 	if err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid ID format"})
// 	}

// 	channelId, err := uuid.Parse(c.Params("channel_id"))
// 	if err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid Channel ID format"})
// 	}

// 	var channelCategory model.ChannelCategory
// 	result := h.db.First(&channelCategory, "category_id = ? and channel_id = ?", id, channelId)
// 	if result.Error != nil {
// 		if result.Error == gorm.ErrRecordNotFound {
// 			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Category not assigned"})
// 		}
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": fmt.Sprintf("Database error %v", result.Error)})
// 	}

// 	err = h.db.Delete(&model.ChannelCategory{}, "category_id = ? and channel_id = ?", id, channelId).Error
// 	if err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": fmt.Sprintf("Database error %v", result.Error)})
// 	}

// 	return c.JSON(channelCategory)
// }

// // deleteCategory удаляет категорию
// // @Summary Удалить категорию
// // @Description Удаляет категорию из системы
// // @Tags categories
// // @Param id path string true "ID категории" Format(uuid)
// // @Security ApiKeyAuth
// // @Success 204
// // @Failure 400 {object} map[string]string
// // @Failure 404 {object} map[string]string
// // @Failure 500 {object} map[string]string
// // @Router /categories/{id} [delete]
// func (h *Handler) deleteCategory(c *fiber.Ctx) error {
// 	claims := c.Locals("claims").(*typex.SessionClaims)
// 	if !slices.Contains(claims.Roles, "admin") {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "not enough rights"})
// 	}

// 	id, err := uuid.Parse(c.Params("id"))
// 	if err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID format"})
// 	}

// 	result := h.db.Where("id = ?", id).Delete(&model.Category{})
// 	if result.Error != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete category"})
// 	}

// 	if result.RowsAffected == 0 {
// 		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Category not found"})
// 	}

// 	return c.SendStatus(fiber.StatusNoContent)
// }
