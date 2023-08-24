package rulesmanager

import (
	"fmt"
	"net/http"
	"time"

	"go.uber.org/zap"

	"github.com/gorilla/mux"
	"gitlab.com/decision-system/lifecycle-manager-backend/pkg/api"
	"gitlab.com/decision-system/lifecycle-manager-backend/pkg/aws"
	"go.uber.org/zap/zapcore"
)

type Config struct {
	AppEnv      string
	AppName     string
	AppVersion  string
	BaseAddr    string
	AWSRegion   string
	AWSEndpoint string
	TableName   string
}

func Start(c *Config) {

	logger, err := newLogger(c)
	if err != nil {
		_, _ = fmt.Println(fmt.Errorf("error initializing logger: " + err.Error()))
		panic(err)
	}

	dynamodb, err := aws.New(c.AWSRegion, c.AWSEndpoint)
	if err != nil {
		logger.Error(err.Error())
		panic(err)
	}

	lifecycle := &api.LifecycleService{
		Logger: logger, DynamoDB: dynamodb,
		TableName: c.TableName,
	}
	router := NewRouter(lifecycle)

	server := http.Server{
		Addr:    c.BaseAddr,
		Handler: router,
	}

	logger.Info("app started")
	logger.Error(server.ListenAndServe().Error())
}

func newLogger(config *Config) (*zap.Logger, error) {
	loggerConfig := zap.NewProductionConfig()
	loggerConfig.Level = zap.NewAtomicLevelAt(zapcore.InfoLevel)
	loggerConfig.InitialFields = map[string]interface{}{
		"app_env":     config.AppEnv,
		"app_name":    config.AppName,
		"app_version": config.AppVersion,
		"base_addr":   config.BaseAddr,
	}
	loggerConfig.Encoding = "json"
	loggerConfig.EncoderConfig = zapcore.EncoderConfig{
		MessageKey: "msg",
		LevelKey:   "level",
		TimeKey:    "ts",
		EncodeTime: zapcore.TimeEncoder(
			func(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
				enc.AppendString(t.UTC().Format("2006-01-02T15:04:05Z0700"))
			}),
		EncodeLevel: zapcore.LowercaseLevelEncoder,
	}

	return loggerConfig.Build()
}

func NewRouter(lifecycle *api.LifecycleService) *mux.Router {
	// creates a new instance of a mux router
	r := mux.NewRouter()
	r.HandleFunc("/rules/add", lifecycle.AddHandler).
		Methods("POST", "OPTIONS").
		Schemes("http", "https")

	r.HandleFunc("/rules/view", lifecycle.ViewHandler).
		Methods("GET").
		Schemes("http", "https")

	return r
}
