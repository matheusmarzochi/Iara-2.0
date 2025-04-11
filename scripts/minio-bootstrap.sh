#!/bin/sh

# Configuration
MC_ALIAS="${MC_ALIAS:-local}"
BUCKET_NAME="${BUCKET_NAME:-iara}"
POLICY_NAME="${POLICY_NAME:-iara-policy}"
USER_NAME="${USER_NAME:-iara-user}"  # new variable for user name
MINIO_URL="${MINIO_URL:-http://minio:9000}"  # new config parameter for MinIO URL

# Generate a random access key and secret key
ACCESS_KEY=$(openssl rand -hex 12)
ACCESS_SECRET=$(openssl rand -hex 12)

# Set MinIO alias
echo "Setting up MinIO connection..."
mc alias set $MC_ALIAS $MINIO_URL $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD

# Create bucket (if not exists)
echo "Creating bucket: $BUCKET_NAME"
mc mb --ignore-existing $MC_ALIAS/$BUCKET_NAME || echo "Bucket '$BUCKET_NAME' already exists, continuing..."

# Create access user using generated credentials
echo "Creating access user: $USER_NAME"
mc admin user add $MC_ALIAS $USER_NAME $ACCESS_SECRET

# Create custom policy (full access to this bucket only)
cat > policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::$BUCKET_NAME",
        "arn:aws:s3:::$BUCKET_NAME/*"
      ]
    }
  ]
}
EOF

# Add the policy
echo "Creating policy: $POLICY_NAME"
mc admin policy create $MC_ALIAS $POLICY_NAME policy.json

# Attach policy to access user
echo "Attaching policy $POLICY_NAME to user $USER_NAME"
mc admin policy attach $MC_ALIAS $POLICY_NAME --user $USER_NAME

# Clean up
rm -f policy.json


echo "✅ MinIO bootstrap complete!"
echo "User Name: $USER_NAME"
