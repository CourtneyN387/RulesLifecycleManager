package api

import (
	"context"
	"encoding/json"
	"errors"

	"net/http"

	"fmt"

	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/google/uuid"
	"gitlab.com/decision-system/lifecycle-manager-backend/pkg/aws"
	"gitlab.com/decision-system/lifecycle-manager-backend/pkg/lifecycle"
	"go.uber.org/zap"
)

type (
	LifecycleService struct {
		Logger    *zap.Logger
		DynamoDB  *aws.DynamoDB
		TableName string
	}
)

func (s *LifecycleService) AddHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "OPTIONS" {
		fmt.Println("Hit the first if statement in add handler")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.WriteHeader(http.StatusOK)
		return
	}
	var request lifecycle.AddRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		fmt.Println("Hit the Sad Path in Add Handler")
		s.Logger.Error("error: " + err.Error())
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.WriteHeader(400)
		resp := &lifecycle.AddResponse{
			Success: false,
		}
		err = json.NewEncoder(w).Encode(resp)
		if err != nil {
			s.Logger.Error("error: " + err.Error())
		}
		return
	}
	s.Logger.Info(fmt.Sprintf("%v", request))
	s.Logger.Info("LifecycleService handled request")

	item, err := createItem(&request)
	if err != nil {
		s.Logger.Error("error: " + err.Error())
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.WriteHeader(500)
		resp := &lifecycle.AddResponse{
			Success: false,
		}
		err = json.NewEncoder(w).Encode(resp)
		if err != nil {
			s.Logger.Error("error: " + err.Error())
		}
		return
	}
	err = s.DynamoDB.PutItemWithContext(context.Background(), &aws.PutItemInput{
		TableName: &s.TableName,
		Item:      item,
	})
	if err != nil {
		s.Logger.Error("error: " + err.Error())
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.WriteHeader(500)
		resp := &lifecycle.AddResponse{
			Success: false,
		}
		err = json.NewEncoder(w).Encode(resp)
		if err != nil {
			s.Logger.Error("error: " + err.Error())
		}
		return
	}
	fmt.Println("Hit the happy path in add handler")
	resp := &lifecycle.AddResponse{
		Success: true,
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	err = json.NewEncoder(w).Encode(resp)
	if err != nil {
		s.Logger.Error("error: " + err.Error())
	}

}

func (s *LifecycleService) ViewHandler(w http.ResponseWriter, _ *http.Request) {
	s.Logger.Info("received request on view endpoint")
	items, err := s.DynamoDB.ScanWithContext(context.Background(), &aws.ScanInput{
		TableName: &s.TableName,
	})

	if err != nil {
		s.Logger.Error("Error: " + err.Error())
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.WriteHeader(500)
		resp := &lifecycle.Error{
			Message: err.Error(),
		}
		err = json.NewEncoder(w).Encode(resp)
		if err != nil {
			s.Logger.Error("error: " + err.Error())
		}
		return
	}

	rules, err := parseItems(items)
	if err != nil {
		s.Logger.Error("Error: " + err.Error())
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.WriteHeader(500)
		resp := &lifecycle.Error{
			Message: err.Error(),
		}
		err = json.NewEncoder(w).Encode(resp)
		if err != nil {
			s.Logger.Error("error: " + err.Error())
		}
		return
	}
	fmt.Println(rules[0].Active)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	err = json.NewEncoder(w).Encode(&lifecycle.ViewResponse{Rules: rules})
	if err != nil {
		s.Logger.Error("error: " + err.Error())
	}
}

func createItem(req *lifecycle.AddRequest) (map[string]*dynamodb.AttributeValue, error) {
	ruleID, err := uuid.NewUUID()
	if err != nil {
		return nil, err
	}
	ruleIDStr := ruleID.String()
	return map[string]*dynamodb.AttributeValue{
		"RuleID":      {S: &ruleIDStr},
		"Set":         {S: &req.Set},
		"Name":        {S: &req.Name},
		"Description": {S: &req.Description},
		"Salience":    {S: &req.Rule.Salience},
		"When":        {S: &req.Rule.When},
		"Then":        {S: &req.Rule.Then},
		"Active":      {BOOL: &req.Active},
	}, nil
}

func parseItems(items []map[string]*dynamodb.AttributeValue) ([]*lifecycle.RuleItem, error) {
	ruleItems := make([]*lifecycle.RuleItem, 0, len(items))
	for _, item := range items {
		ruleItem := &lifecycle.RuleItem{Rule: lifecycle.Rule{}}
		for k, v := range item {
			switch k {
			case "Active":
				ruleItem.Active = *v.BOOL
			case "Set":
				ruleItem.Set = *v.S
			case "Description":
				ruleItem.Description = *v.S
			case "When":
				ruleItem.Rule.When = *v.S
			case "Salience":
				ruleItem.Rule.Salience = *v.S
			case "RuleID":
				ruleItem.ID = *v.S
			case "Then":
				ruleItem.Rule.Then = *v.S
			case "Name":
				ruleItem.Name = *v.S
			default:
				return nil, errors.New("Unrecognized atribute value in dynamo item")
			}
		}
		ruleItems = append(ruleItems, ruleItem)
	}
	return ruleItems, nil
}
