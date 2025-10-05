package s3

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/aws/smithy-go"
	smithyendpoints "github.com/aws/smithy-go/endpoints"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type S3Client struct {
	S3     *s3.Client
	Bucket string
}

type customResolver struct {
	BaseURL string
}

func (c *customResolver) ResolveEndpoint(_ context.Context, _ s3.EndpointParameters) (smithyendpoints.Endpoint, error) {
	u, err := url.Parse(fmt.Sprintf("https://%s", c.BaseURL))
	if err != nil {
		return smithyendpoints.Endpoint{}, err
	}
	return smithyendpoints.Endpoint{
		URI:        *u,
		Headers:    http.Header{},
		Properties: smithy.Properties{},
	}, nil
}

func NewS3Client(region, accessKey, secretKey, endpoint string) (*S3Client, error) {
	log.Println("create new s3 client")
	bucket := strings.SplitN(endpoint, ".", 2)[0]
	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
	)
	if err != nil {
		return nil, err
	}
	resolver := &customResolver{BaseURL: endpoint}

	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.EndpointResolverV2 = resolver
		o.UsePathStyle = true
	})
	return &S3Client{S3: client, Bucket: bucket}, nil
}

func (s *S3Client) UploadFile(ctx context.Context, file io.Reader, postID string, fileID string, path string, endpoint string) (string, string, error) {
	fileName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), fileID)
	key := fmt.Sprintf("%s/%s/%s", path, postID, fileName)

	_, err := s.S3.PutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(s.Bucket),
		Key:    aws.String(key),
		Body:   file,
		ACL:    types.ObjectCannedACLPublicRead,
	})
	if err != nil {
		return "", "", err
	}

	urlS3 := fmt.Sprintf("https://%s/%s", endpoint, key)
	return fileName, urlS3, nil
}

func (s *S3Client) DeleteFile(ctx context.Context, key string) error {
	_, err := s.S3.HeadObject(ctx, &s3.HeadObjectInput{
		Bucket: aws.String(s.Bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		if strings.Contains(err.Error(), "NotFound") {
			return fmt.Errorf("file %s does not exist in S3", key)
		}
		return fmt.Errorf("failed to check file %s: %w", key, err)
	}

	_, err = s.S3.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(s.Bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return fmt.Errorf("failed to delete file %s from S3: %w", key, err)
	}
	return nil
}
func (s *S3Client) GeneratePresignedURL(ctx context.Context, fileName string, fileID string, folder string) string {
	key := fmt.Sprintf("%s/%s/%s", folder, fileID, fileName)
	presignClient := s3.NewPresignClient(s.S3)
	req, err := presignClient.PresignGetObject(context.TODO(),
		&s3.GetObjectInput{
			Bucket: aws.String(s.Bucket),
			Key:    aws.String(key),
		},
		s3.WithPresignExpires(1*time.Hour),
	)
	if err != nil {
		log.Printf("failed to generate presigned url for file %s in bucket %s: %v", fileName, s.Bucket, err)
		return ""
	}
	return req.URL
}
