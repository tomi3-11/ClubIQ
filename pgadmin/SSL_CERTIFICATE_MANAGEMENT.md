# SSL Certificate Management for pgAdmin

## Overview

This document describes the SSL certificate configuration for pgAdmin and provides instructions for certificate renewal and rotation.

## Current Certificate Information

- **Certificate File**: `pgadmin/pgadmin.crt`
- **Private Key File**: `pgadmin/pgadmin.key` (not committed to version control)
- **Issuer**: AppFactory, Nairobi, Kenya
- **Valid From**: January 3, 2026
- **Expires**: **January 3, 2027**
- **Key Algorithm**: RSA 2048-bit

⚠️ **IMPORTANT**: The certificate will expire on **January 3, 2027**. Plan to renew it before this date.

## Certificate Location

The certificate and key files are mounted into the pgAdmin container:
- Container path: `/certs/server.cert` (certificate)
- Container path: `/certs/server.key` (private key)

## Security Notes

- The private key file (`pgadmin.key`) is intentionally excluded from version control via `.gitignore`
- Never commit private key files to the repository
- Store private keys securely and restrict access appropriately

## Certificate Renewal Process

### When to Renew

**Recommended**: Renew the certificate at least 30 days before expiration.
- Current expiration: **January 3, 2027**
- Recommended renewal date: **December 4, 2026** or earlier

### Step 1: Generate a New Certificate and Private Key

You can generate a new self-signed certificate using OpenSSL:

```bash
# Navigate to the pgadmin directory
cd pgadmin

# Generate a new private key and certificate (valid for 365 days)
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout pgadmin.key \
  -out pgadmin.crt \
  -days 365 \
  -subj "/C=KE/ST=Nairobi/L=Nairobi/O=AppFactory"
```

**Options explained:**
- `-x509`: Generate a self-signed certificate
- `-newkey rsa:2048`: Create a new RSA key with 2048-bit encryption
- `-nodes`: Don't encrypt the private key (no password required)
- `-keyout`: Output file for the private key
- `-out`: Output file for the certificate
- `-days 365`: Certificate valid for 1 year (adjust as needed)
- `-subj`: Certificate subject information (update as needed)

### Step 2: Set Proper Permissions

Ensure the private key has restricted permissions:

```bash
chmod 600 pgadmin/pgadmin.key
chmod 644 pgadmin/pgadmin.crt
```

### Step 3: Verify the New Certificate

Check the certificate details:

```bash
openssl x509 -in pgadmin/pgadmin.crt -text -noout
```

Verify the expiration date:

```bash
openssl x509 -in pgadmin/pgadmin.crt -noout -dates
```

### Step 4: Restart the pgAdmin Container

After replacing the certificate files, restart the pgAdmin container to load the new certificate:

```bash
# Using make (recommended)
make restart-pgadmin

# Or using docker compose directly
docker compose restart pgadmin
```

If the container doesn't exist, rebuild and start it:

```bash
make build
make up
```

## Monitoring Certificate Expiration

### Manual Check

To check when the current certificate expires:

```bash
openssl x509 -in pgadmin/pgadmin.crt -noout -enddate
```

### Automated Monitoring

Consider setting up automated monitoring for certificate expiration. You can add a script to your CI/CD pipeline or use a monitoring tool to alert when certificates are approaching expiration.

Example bash script to check expiration (add to your monitoring tools):

```bash
#!/bin/bash
CERT_FILE="pgadmin/pgadmin.crt"
EXPIRY_DATE=$(openssl x509 -in "$CERT_FILE" -noout -enddate | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_EPOCH=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $CURRENT_EPOCH) / 86400 ))

if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
    echo "WARNING: Certificate expires in $DAYS_UNTIL_EXPIRY days!"
    exit 1
fi
```

## Production Considerations

For production environments, consider:

1. **Certificate Authority (CA)**: Use certificates from a trusted CA instead of self-signed certificates
2. **Certificate Management Tools**: Use tools like Let's Encrypt, AWS Certificate Manager, or similar services
3. **Automated Renewal**: Implement automated certificate renewal processes
4. **Monitoring**: Set up alerts for certificate expiration (30, 14, and 7 days before expiry)
5. **Key Storage**: Use secure key management solutions (e.g., HashiCorp Vault, AWS Secrets Manager)

## Troubleshooting

### Certificate Not Found Error

If you see errors about missing certificate files:
1. Ensure `pgadmin/pgadmin.key` exists (generate it if missing)
2. Check file permissions
3. Verify the volume mounts in `docker-compose.yml`

### Certificate Verification Failed

If pgAdmin reports certificate verification issues:
1. Verify the certificate is valid: `openssl x509 -in pgadmin/pgadmin.crt -noout -text`
2. Ensure the certificate and key match: 
   ```bash
   openssl x509 -noout -modulus -in pgadmin/pgadmin.crt | openssl md5
   openssl rsa -noout -modulus -in pgadmin/pgadmin.key | openssl md5
   ```
   (The MD5 hashes should match)

## Initial Setup (If Key File is Missing)

If you're setting up the project for the first time and the `pgadmin.key` file is missing:

```bash
# Generate the private key to match the existing certificate
# Note: This will create a NEW key, which won't match the existing certificate
# You'll need to generate BOTH a new certificate and key together

cd pgadmin
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout pgadmin.key \
  -out pgadmin.crt \
  -days 365 \
  -subj "/C=KE/ST=Nairobi/L=Nairobi/O=AppFactory"

chmod 600 pgadmin.key
chmod 644 pgadmin.crt
```

## References

- [OpenSSL Documentation](https://www.openssl.org/docs/)
- [pgAdmin SSL Configuration](https://www.pgadmin.org/docs/pgadmin4/latest/enabling_https.html)
- [Docker Compose Volumes](https://docs.docker.com/compose/compose-file/compose-file-v3/#volumes)
