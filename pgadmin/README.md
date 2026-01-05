# pgAdmin Configuration

This directory contains configuration files for pgAdmin.

## Files

- **`pgadmin.crt`** - SSL certificate for pgAdmin (committed to repository)
- **`pgadmin.key`** - Private key for SSL certificate (NOT committed - generate locally)
- **`servers.json`** - Pre-configured server connection settings

## SSL Certificate

⚠️ **Certificate Expiration**: The current certificate expires on **January 3, 2027**

### Quick Commands

Check certificate expiration:
```bash
make check-ssl-cert
```

Generate a new certificate:
```bash
make generate-ssl-cert
```

### Documentation

For complete SSL certificate management instructions, see:
📄 **[SSL_CERTIFICATE_MANAGEMENT.md](./SSL_CERTIFICATE_MANAGEMENT.md)**

## First-Time Setup

If you're setting up the project for the first time, you need to generate the private key:

```bash
make generate-ssl-cert
```

This will create both `pgadmin.crt` and `pgadmin.key` files.

## Security Note

The `pgadmin.key` file is intentionally excluded from version control. Never commit private key files to the repository.
