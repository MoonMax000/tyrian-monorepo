package elastic

import (
	//"encoding/json"
	"fmt"
	//"github.com/Capstane/AXA-socialweb-posts/internal/model"
	//"github.com/Capstane/authlib/utilx"
	"github.com/elastic/go-elasticsearch/v8"
	"log"
	//"strings"
)

type ElasticSearch struct {
	ES *elasticsearch.Client
}

func NewElasticClient(host string, port string, user string, password string) (*elasticsearch.Client, error) {
	address := fmt.Sprintf("http://%s:%s", host, port)
	cfg := elasticsearch.Config{
		Addresses: []string{address},
		Username:  user,
		Password:  password,
	}

	es, err := elasticsearch.NewClient(cfg)
	if err != nil {
		return nil, err
	}

	res, err := es.Info()
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.IsError() {
		return nil, fmt.Errorf("error connecting to ES: %s", res.String())
	}
	log.Println("Elasticsearch connected")

	return es, nil
}
