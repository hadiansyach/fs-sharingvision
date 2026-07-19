package validator

import (
	"errors"
	"strings"

	"article-service/internal/model"
)

var validStatuses = map[string]bool{
	"publish": true,
	"draft":   true,
	"thrash":  true,
}

func ValidateArticle(req model.ArticleRequest) error {
	if strings.TrimSpace(req.Title) == "" || len(req.Title) < 20 {
		return errors.New("title is required and must be at least 20 characters")
	}
	if strings.TrimSpace(req.Content) == "" || len(req.Content) < 200 {
		return errors.New("content is required and must be at least 200 characters")
	}
	if strings.TrimSpace(req.Category) == "" || len(req.Category) < 3 {
		return errors.New("category is required and must be at least 3 characters")
	}
	if strings.TrimSpace(req.Status) == "" {
		return errors.New("status is required")
	}
	if !validStatuses[strings.ToLower(req.Status)] {
		return errors.New("status must be one of: publish, draft, thrash")
	}
	return nil
}
