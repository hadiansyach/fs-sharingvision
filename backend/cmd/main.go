package main

import (
	"log"
	"net/http"
	"strconv"
	"strings"

	"article-service/internal/config"
	"article-service/internal/database"
	"article-service/internal/handler"
	"article-service/internal/repository"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName)
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}
	defer db.Close()

	repo := repository.NewArticleRepository(db)
	articleHandler := handler.NewArticleHandler(repo)

	mux := http.NewServeMux()

	mux.HandleFunc("/article/", func(w http.ResponseWriter, r *http.Request) {
		path := strings.Trim(r.URL.Path, "/")
		segments := strings.Split(path, "/")

		switch {
		case len(segments) == 1 && r.Method == http.MethodPost:
			articleHandler.Create(w, r)

		case len(segments) == 3 && r.Method == http.MethodGet:
			articleHandler.GetAll(w, r)

		case len(segments) == 2:
			id, err := strconv.Atoi(segments[1])
			if err != nil {
				http.Error(w, "invalid id", http.StatusBadRequest)
				return
			}
			switch r.Method {
			case http.MethodGet:
				articleHandler.GetByID(w, r, id)
			case http.MethodPut, http.MethodPatch:
				articleHandler.Update(w, r, id)
			case http.MethodDelete:
				articleHandler.Delete(w, r, id)
			default:
				http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			}

		default:
			http.Error(w, "not found", http.StatusNotFound)
		}
	})

	log.Printf("server running on port %s", cfg.AppPort)
	log.Fatal(http.ListenAndServe(":"+cfg.AppPort, mux))
}
