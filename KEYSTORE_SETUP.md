# Android Keystore Setup Guide for Bible Blitz

## Problem Diagnosis

The error `Tag number over 30 is not supported` occurs when:
1. The keystore format is incompatible with the Android build tools
2. The keystore was created with a newer Java version using unsupported algorithms
3. The signing configuration is not properly set up in the build.gradle

## Solution Implemented

### 1. Updated GitHub Actions Workflow (`.github/workflows/android-release.yml`)

The workflow now:
- Creates a `keystore.properties` file with signing credentials
- Uses the standard Gradle wrapper command (`./gradlew clean bundleRelease`)
- Lets Gradle handle the signing configuration automatically

### 2. Updated App Build Configuration (`app/build.gradle`)

Added proper signing configuration that:
- Loads keystore properties from `keystore.properties` file
- Configures the release build to use the signing config
- Only applies signing if the keystore file exists (safe for local development)

### 3. Security Best Practices

Created `.gitignore` to prevent accidental commits of:
- Keystore files (*.jks, *.keystore)
- Keystore properties file
- Other sensitive build files

## GitHub Secrets Required

Set these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

1. **ANDROID_KEYSTORE_BASE64**: Base64-encoded keystore file
2. **ANDROID_KEYSTORE_PASSWORD**: Keystore password
3. **ANDROID_KEY_ALIAS**: Key alias name
4. **ANDROID_KEY_PASSWORD**: Key password

### How to Create Base64-Encoded Keystore

```bash
# On Linux/Mac
base64 -i your-keystore.jks | tr -d '\n' > keystore-base64.txt

# On Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("your-keystore.jks")) | Out-File -Encoding ASCII keystore-base64.txt
```

## Creating a New Keystore (If Needed)

If your current keystore has compatibility issues, create a new one:

```bash
keytool -genkey -v -keystore upload-keystore.jks \
  -alias upload \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storetype JKS
```

**Important Notes:**
- Use **JKS** format (not PKCS12) for maximum compatibility
- Use **RSA** algorithm with **2048-bit** key size
- Keep the keystore and passwords secure - you'll need them for all future releases
- If you lose the keystore, you cannot update your app on Google Play Store

## Local Development

For local signed builds, create `keystore.properties` in the project root:

```properties
storeFile=path/to/your-keystore.jks
storePassword=your_store_password
keyAlias=your_key_alias
keyPassword=your_key_password
```

Then run:
```bash
./gradlew clean bundleRelease
```

The signed AAB will be at:
```
app/build/outputs/bundle/release/app-release.aab
```

## Troubleshooting

### Error: "Tag number over 30 is not supported"
- Your keystore may be in PKCS12 format or created with incompatible algorithms
- Solution: Create a new JKS keystore with RSA-2048 as shown above

### Error: "Keystore was tampered with, or password was incorrect"
- Check that your base64 encoding/decoding is correct
- Verify the password secrets match your keystore

### Error: "Failed to read key [alias] from store"
- Verify the key alias exists in your keystore
- Check that the key password is correct (may differ from store password)

## Verification

After implementing these changes:
1. Commit and push the updated files
2. Go to GitHub Actions → Run workflow manually
3. Check the build logs for successful signing
4. Download the signed AAB artifact from the workflow run
