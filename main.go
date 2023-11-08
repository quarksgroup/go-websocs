package main

import (
	"fmt"
	"net/http"
)

type T struct {
	Msg   string
	Count int
}

func main() {
	setupAPI()
}

func setupAPI() {
	manager := NewManager()

	http.Handle("/", http.FileServer(http.Dir("./client")))
	http.HandleFunc("/websocs", manager.serveWS)

	port := 8050
	fmt.Println("Server running on port", port)
	http.ListenAndServe(fmt.Sprintf(":%v", port), nil)
}
