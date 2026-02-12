#!/bin/bash

export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org3.example.com/

ORG3_CA_URL=http://localhost:11054
ORG3_CA_CERT=${PWD}/organizations/fabric-ca/org3/ca-cert.pem

mkdir -p $FABRIC_CA_CLIENT_HOME

echo "Enrolling the CA admin"
fabric-ca-client enroll -u $ORG3_CA_URL --mspdir ${FABRIC_CA_CLIENT_HOME}/msp --tls.certfiles $ORG3_CA_CERT

cat > ${FABRIC_CA_CLIENT_HOME}/msp/config.yaml <<EOF
NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-org3.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-org3.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-org3.pem
    OrganizationalUnitIdentifier: admin
EOF

echo "Registering peer, user, admin"
fabric-ca-client register --caname ca-org3 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles $ORG3_CA_CERT -u $ORG3_CA_URL
fabric-ca-client register --caname ca-org3 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles $ORG3_CA_CERT -u $ORG3_CA_URL
fabric-ca-client register --caname ca-org3 --id.name org3admin --id.secret org3adminpw --id.type admin --tls.certfiles $ORG3_CA_CERT -u $ORG3_CA_URL

echo "Enrolling peer0"
fabric-ca-client enroll -u ${ORG3_CA_URL}/peer0:peer0pw \
--caname ca-org3 \
-M ${FABRIC_CA_CLIENT_HOME}/peers/peer0.org3.example.com/msp \
--csr.hosts peer0.org3.example.com \
--csr.hosts localhost \
--tls.certfiles $ORG3_CA_CERT

cp ${FABRIC_CA_CLIENT_HOME}/msp/config.yaml ${FABRIC_CA_CLIENT_HOME}/peers/peer0.org3.example.com/msp/config.yaml

echo "Generating peer0 TLS certificates"
fabric-ca-client enroll -u ${ORG3_CA_URL}/peer0:peer0pw \
--caname ca-org3 \
-M ${FABRIC_CA_CLIENT_HOME}/peers/peer0.org3.example.com/tls \
--enrollment.profile tls \
--csr.hosts peer0.org3.example.com \
--csr.hosts localhost \
--tls.certfiles $ORG3_CA_CERT

echo "Enrolling Org3 user"
fabric-ca-client enroll -u ${ORG3_CA_URL}/user1:user1pw \
--caname ca-org3 \
-M ${FABRIC_CA_CLIENT_HOME}/users/User1@org3.example.com/msp \
--tls.certfiles $ORG3_CA_CERT

echo "Enrolling Org3 admin"
fabric-ca-client enroll -u ${ORG3_CA_URL}/org3admin:org3adminpw \
--caname ca-org3 \
-M ${FABRIC_CA_CLIENT_HOME}/users/Admin@org3.example.com/msp \
--tls.certfiles $ORG3_CA_CERT

cp ${FABRIC_CA_CLIENT_HOME}/msp/config.yaml ${FABRIC_CA_CLIENT_HOME}/users/Admin@org3.example.com/msp/config.yaml
