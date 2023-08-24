package aws

import (
	"context"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

type (
	DynamoDB struct {
		Client dynamodbiface.DynamoDBAPI
	}
	PutItemInput struct {
		Item      map[string]*dynamodb.AttributeValue `type:"map" required:"true"`
		TableName *string                             `min:"3" type:"string" required:"true"`
	}

	ScanInput struct {
		TableName *string
	}
)

func New(region, endpoint string) (*DynamoDB, error) {
	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String(region),
		Endpoint:    aws.String(endpoint),
		Credentials: credentials.NewCredentials(&credentials.EnvProvider{}),
	})
	if err != nil {
		return nil, err
	}

	return &DynamoDB{
		Client: dynamodb.New(sess),
	}, nil
}

func (d *DynamoDB) PutItemWithContext(ctx context.Context, input *PutItemInput) error {
	_, err := d.Client.PutItemWithContext(ctx, &dynamodb.PutItemInput{
		TableName: input.TableName,
		Item:      input.Item,
	})
	return err
}

func (d *DynamoDB) ScanWithContext(ctx context.Context, input *ScanInput) ([]map[string]*dynamodb.AttributeValue, error) {
	resp, err := d.Client.ScanWithContext(ctx, &dynamodb.ScanInput{
		TableName: input.TableName,
	})
	if err != nil {
		return nil, err
	}
	return resp.Items, nil
}
