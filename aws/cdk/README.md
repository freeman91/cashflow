# CDK Infrastructure

This directory contains the AWS CDK infrastructure for the CashFlow application.

## Architecture

### Lambda Layer

A shared Lambda layer is created in the root stack that contains:

- All Python dependencies (from `requirements.txt`)
- All service code from `../services/`
- Shared across all nested stacks

### Stacks

1. **RootStack** - Main stack that creates the shared Lambda layer
2. **DynamoDBStack** - Creates DynamoDB tables
3. **CronjobsStack** - Creates EventBridge rules and Lambda functions for scheduled tasks
4. **ApiGatewayStack** - Creates API Gateway and Lambda function for REST API (commented out)

## Lambda Layer Structure

The Lambda layer is built automatically when deploying and contains:

```
lambda-layer/
└── python/
    ├── services/          # Application code
    ├── cronjobs_handler.py
    ├── main.py
    ├── requirements.txt
    └── [dependencies]     # Installed Python packages
```

## Deployment

1. Set environment variables:

   ```bash
   export AWS_PROFILE=your-profile
   export REGION=us-east-2
   export ENV=production
   export APP_ID=cashflow
   export CRYPTO_COMPARE_KEY=your-key
   ```

2. Deploy the infrastructure:
   ```bash
   cd aws/cdk
   python build.py
   ```

## Benefits of Lambda Layer Architecture

1. **Code Reuse**: All Lambda functions share the same layer
2. **Smaller Function Size**: Functions only contain their specific handler code
3. **Faster Deployments**: Layer is built once and reused
4. **Easier Maintenance**: Dependencies managed in one place
5. **Cost Optimization**: Reduced cold start times due to smaller function size

## Cronjobs

The following scheduled tasks are configured:

- **Crypto Price Updates**: 6:30 AM and 6:30 PM daily
- **Stock Price Updates**: 6:30 PM daily
- **Value History Saves**: 10:50 AM and 11:50 PM daily
- **Transaction Generation**: Midnight daily
