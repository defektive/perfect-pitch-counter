# Keystore Setup for Play Store

## Generate Keystore

Run this locally once to create your keystore:

```bash
cd react-native
mkdir -p app/build/

keytool -genkeypair \
  -alias pitch-counter \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Your Name, OU=Your Org, O=Your Company, L=City, ST=State, C=US" \
  -keystore app/build/keystore.jks \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD
```

### Response
You'll see prompts like:
- First and last name: Your name
- Organizational unit: (optional)
- Organization: (optional)
- City: Your city
- State: Your state
- Country: US (or your country code)

Press Enter for defaults where not specified.

### Verify Keystore
```bash
keytool -list -v -keystore app/build/keystore.jks -storepass YOUR_STORE_PASSWORD
```

## Encode for GitHub Secrets

```bash
# Encode keystore
cat app/build/keystore.jks | base64 | tr -d '\n' > keystore-base64.txt

# Copy to clipboard
cat keystore-base64.txt

# Save secrets
# GITHUB_TOKEN: Default GitHub token
# SERVICE_ACCOUNT_JSON: Play Store service account (base64)
# KEYSTORE_BASE64: Paste output from above
# KEYSTORE_PASSWORD: YOUR_STORE_PASSWORD
# KEY_PASSWORD: YOUR_KEY_PASSWORD
# KEY_ALIAS: pitch-counter
```

## Upload to GitHub

```bash
# Store in GitHub repository secrets
# Go to: Settings → Secrets and variables → Actions → New repository secret

echo "KEYSTORE_BASE64=$(cat keystore-base64.txt)" >> .github/workflows/android-build.yaml
```

Or better, store as secrets:
1. Repository Settings → Secrets and variables → Actions
2. Add new secret for each:
   - `KEYSTORE_BASE64`
   - `KEYSTORE_PASSWORD`
   - `KEY_PASSWORD`
   - `KEY_ALIAS`
   - `SERVICE_ACCOUNT_JSON`

## Regenerate Keystore

If you need a new keystore (e.g., app update):
1. Generate new keystore (different key/alias recommended)
2. Upload to Play Store Console (replace existing)
3. Update GitHub secrets
4. Push new tag to trigger rebuild

## Keep Keystore Safe

- **Never commit** keystore files to git
- Use `.gitignore` to exclude: `app/build/keystore.jks`
- Store base64 in GitHub secrets only
- Rotate keys every 2-3 years

## Cleanup

```bash
# Remove test keystores
rm app/build/keystore.jks keystore-base64.txt

# Verify not tracked
git status
```
