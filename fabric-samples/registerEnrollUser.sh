#!/bin/bash

# Usage:
# ./registerEnrollUser.sh <buyer|vendor> <type1|type2|none> <username> <password>
# Examples:
# ./registerEnrollUser.sh buyer type1 alice alicepw
# ./registerEnrollUser.sh buyer type2 bob bobpw
# ./registerEnrollUser.sh vendor none charlie charliepw

if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <buyer|vendor> <type1|type2|none> <username> <password>"
    exit 1
fi

ORG_NAME=$1    # buyer or vendor
TYPE=$2
USERNAME=$3
PASSWORD=$4

# Map to actual network org directories and CA info
if [ "$ORG_NAME" == "buyer" ]; then
    ORG=org1
    CA_PORT=7054
    CANAME=ca-org1
    ORG_HOME=/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com
elif [ "$ORG_NAME" == "vendor" ]; then
    ORG=org2
    CA_PORT=8054
    CANAME=ca-org2
    ORG_HOME=/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com
else
    echo "Invalid org: $ORG_NAME. Must be buyer or vendor."
    exit 1
fi

CA_CERT=${ORG_HOME}/ca/ca.${ORG}.example.com-cert.pem
ADMIN_MSP_DIR=${ORG_HOME}/users/Admin@${ORG}.example.com
USER_MSP_DIR=${ORG_HOME}/users/${USERNAME}/msp

# Set affiliation for buyer type differentiation
if [ "$ORG_NAME" == "buyer" ]; then
    if [ "$TYPE" == "type1" ]; then
        AFFILIATION="buyer.type1"
    elif [ "$TYPE" == "type2" ]; then
        AFFILIATION="buyer.type2"
    else
        echo "Invalid type for buyer: $TYPE. Must be type1 or type2."
        exit 1
    fi
else
    AFFILIATION="vendor"
fi

# 1️⃣ Enroll admin if not already done
if [ ! -d "$ADMIN_MSP_DIR" ]; then
    echo "==> Enrolling admin for $ORG_NAME..."
    export FABRIC_CA_CLIENT_HOME=$ORG_HOME
    fabric-ca-client enroll \
      -u https://admin:adminpw@localhost:$CA_PORT \
      --caname $CANAME \
      -M $ADMIN_MSP_DIR \
      --tls.certfiles $CA_CERT
    if [ $? -ne 0 ]; then
        echo "ERROR: Admin enrollment failed for $ORG_NAME!"
        exit 1
    fi
fi

# 2️⃣ Register user
echo "==> Registering user $USERNAME with $ORG_NAME CA, affiliation: $AFFILIATION..."
export FABRIC_CA_CLIENT_HOME=$ADMIN_MSP_DIR
fabric-ca-client register \
  --caname $CANAME \
  --id.name $USERNAME \
  --id.secret $PASSWORD \
  --id.type client \
  --id.affiliation $AFFILIATION \
  --tls.certfiles $CA_CERT
if [ $? -ne 0 ]; then
    echo "ERROR: Registration failed!"
    exit 1
fi

# 3️⃣ Enroll user
echo "==> Enrolling user $USERNAME..."
fabric-ca-client enroll \
  -u https://$USERNAME:$PASSWORD@localhost:$CA_PORT \
  --caname $CANAME \
  -M $USER_MSP_DIR \
  --tls.certfiles $CA_CERT
if [ $? -ne 0 ]; then
    echo "ERROR: Enrollment failed!"
    exit 1
fi

echo "==> User $USERNAME successfully registered and enrolled under $ORG_NAME ($TYPE)!"
echo "MSP directory: $USER_MSP_DIR"
