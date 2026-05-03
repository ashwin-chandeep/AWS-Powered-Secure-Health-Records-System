@REM Maven Wrapper startup batch script
@REM This downloads Maven if not found and runs it

@echo off
setlocal

set "MAVEN_PROJECTBASEDIR=%~dp0"
set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties"

@REM If maven-wrapper.jar doesn't exist, download it
if not exist "%WRAPPER_JAR%" (
    echo Downloading Maven wrapper...
    powershell -Command "Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar' -OutFile '%WRAPPER_JAR%'"
)

@REM Run Maven via wrapper
java -jar "%WRAPPER_JAR%" %*
