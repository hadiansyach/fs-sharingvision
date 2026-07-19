package repository

import (
	"database/sql"

	"article-service/internal/model"
)

type ArticleRepository struct {
	db *sql.DB
}

func NewArticleRepository(db *sql.DB) *ArticleRepository {
	return &ArticleRepository{db: db}
}

func (r *ArticleRepository) Create(req model.ArticleRequest) (int64, error) {
	query := `INSERT INTO posts (title, content, category, status) VALUES (?, ?, ?, ?)`
	result, err := r.db.Exec(query, req.Title, req.Content, req.Category, req.Status)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func (r *ArticleRepository) GetAll(limit, offset int) ([]model.Article, error) {
	query := `SELECT id, title, content, category, status, created_date, updated_date
	          FROM posts ORDER BY id DESC LIMIT ? OFFSET ?`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var articles []model.Article
	for rows.Next() {
		var a model.Article
		if err := rows.Scan(&a.ID, &a.Title, &a.Content, &a.Category, &a.Status, &a.CreatedDate, &a.UpdatedDate); err != nil {
			return nil, err
		}
		articles = append(articles, a)
	}
	return articles, nil
}

func (r *ArticleRepository) GetByID(id int) (*model.Article, error) {
	query := `SELECT id, title, content, category, status, created_date, updated_date
	          FROM posts WHERE id = ?`
	var a model.Article
	err := r.db.QueryRow(query, id).Scan(&a.ID, &a.Title, &a.Content, &a.Category, &a.Status, &a.CreatedDate, &a.UpdatedDate)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func (r *ArticleRepository) Update(id int, req model.ArticleRequest) error {
	query := `UPDATE posts SET title = ?, content = ?, category = ?, status = ? WHERE id = ?`
	_, err := r.db.Exec(query, req.Title, req.Content, req.Category, req.Status, id)
	return err
}

func (r *ArticleRepository) Delete(id int) error {
	query := `DELETE FROM posts WHERE id = ?`
	_, err := r.db.Exec(query, id)
	return err
}
