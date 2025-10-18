#!/bin/bash

# Usage: ./registerEnrollOrg1User.sh <username> <password>

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <username> <password>"
    exit 1
fi

USERNAME=$1
PASSWORD=$2

# Paths and CA info
FABRIC_CA_CLIENT_HOME=/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com
ORG1_CA_URL=https://localhost:7054            # Change if your CA port is different
ORG1_CA_CERT=${FABRIC_CA_CLIENT_HOME}/ca/ca.org1.example.com-cert.pem
CANAME=ca-org1

# MSP output folder
USER_MSP_DIR=${FABRIC_CA_CLIENT_HOME}/users/${USERNAME}/msp
USER_TLS_DIR=${FABRIC_CA_CLIENT_HOME}/users/${USERNAME}/tls

echo "==> Registering user $USERNAME with Org1 CA..."
fabric-ca-client register \
  --caname $CANAME \
  --id.name $USERNAME \
  --id.secret $PASSWORD \
  --id.type client \
  --tls.certfiles $ORG1_CA_CERT

if [ $? -ne 0 ]; then
    echo "ERROR: Registration failed!"
    exit 1
fi

echo "==> Enrolling user $USERNAME..."
fabric-ca-client enroll \
  -u https://$USERNAME:$PASSWORD@localhost:7054 \
  --caname $CANAME \
  -M $USER_MSP_DIR \
  --tls.certfiles $ORG1_CA_CERT

if [ $? -ne 0 ]; then
    echo "ERROR: Enrollment failed!"
    exit 1
fi

echo "==> User $USERNAME successfully registered and enrolled!"
echo "MSP directory: $USER_MSP_DIR"
