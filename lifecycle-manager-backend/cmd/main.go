package main

import (
	"os"

	"gitlab.com/decision-system/lifecycle-manager-backend/internal/rulesmanager"
)

func main() {
	rulesmanager.Start(&rulesmanager.Config{
		AppEnv:      getEnvOrDefault("APP_ENV", "local"),
		AppName:     getEnvOrDefault("APP_NAME", "lifecycle manager"),
		AppVersion:  getEnvOrDefault("APP_VERSION", "v0.0.1"),
		BaseAddr:    getEnvOrDefault("BASE_ADDR", "0.0.0.0:8100"), // may need to change port
		AWSEndpoint: getEnvOrDefault("AWS_ENDPOINT", "http://dynamodb:8000"),
		AWSRegion:   getEnvOrDefault("AWS_REGION", "us-east-1"),
		TableName:   getEnvOrDefault("TABLE_NAME", "rain-decision-system-rules-local"),
	})
}

func getEnvOrDefault(name string, defaultVal string) string {
	if val := os.Getenv(name); val != "" {
		return val
	}

	return defaultVal
}
