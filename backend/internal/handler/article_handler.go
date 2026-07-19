package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"article-service/internal/model"
	"article-service/internal/repository"
	"article-service/internal/validator"
)

type ArticleHandler struct {
	repo *repository.ArticleRepository
}

func NewArticleHandler(repo *repository.ArticleRepository) *ArticleHandler {
	return &ArticleHandler{repo: repo}
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

// POST /article/
func (h *ArticleHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.ArticleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}
	if err := validator.ValidateArticle(req); err != nil {
		writeError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}
	id, err := h.repo.Create(req)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create article")
		return
	}
	writeJSON(w, http.StatusCreated, map[string]interface{}{"id": id, "message": "article created"})
}

// GET /article/{limit}/{offset}
func (h *ArticleHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) != 3 {
		writeError(w, http.StatusBadRequest, "expected path /article/{limit}/{offset}")
		return
	}
	limit, err := strconv.Atoi(parts[1])
	if err != nil || limit <= 0 {
		writeError(w, http.StatusBadRequest, "limit must be a positive integer")
		return
	}
	offset, err := strconv.Atoi(parts[2])
	if err != nil || offset < 0 {
		writeError(w, http.StatusBadRequest, "offset must be zero or positive integer")
		return
	}
	articles, err := h.repo.GetAll(limit, offset)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch articles")
		return
	}
	writeJSON(w, http.StatusOK, articles)
}

// GET /article/{id}
func (h *ArticleHandler) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	article, err := h.repo.GetByID(id)
	if err == sql.ErrNoRows {
		writeError(w, http.StatusNotFound, "article not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch article")
		return
	}
	writeJSON(w, http.StatusOK, article)
}

// PUT/PATCH /article/{id}
func (h *ArticleHandler) Update(w http.ResponseWriter, r *http.Request, id int) {
	var req model.ArticleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}
	if err := validator.ValidateArticle(req); err != nil {
		writeError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}
	if _, err := h.repo.GetByID(id); err == sql.ErrNoRows {
		writeError(w, http.StatusNotFound, "article not found")
		return
	}
	if err := h.repo.Update(id, req); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to update article")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"message": "article updated"})
}

// DELETE /article/{id}
func (h *ArticleHandler) Delete(w http.ResponseWriter, r *http.Request, id int) {
	if _, err := h.repo.GetByID(id); err == sql.ErrNoRows {
		writeError(w, http.StatusNotFound, "article not found")
		return
	}
	if err := h.repo.Delete(id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete article")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"message": "article deleted"})
}
