## **Event-Driven Architecture with IBM Event Streams**




This project demonstrates a **distributed, event-driven microservices architecture** built with NestJS, Apache Kafka, and Docker. It includes three core services (`customer-service`, `transaction-service`, `notification-service`) that communicate asynchronously via Kafka topics. The application is containerized, deployed to IBM Cloud Code Engine, and leverages GitHub Actions for CI/CD.

-   **Customer Service** – Manages customer data and publishes events when a new customer is created.
    
-   **Transaction Service** – Handles financial transactions and produces events when a transaction occurs.
    
-   **Notification Service** – Listens for customer and transaction events to send real-time notifications.

    ---

### High Level Architecture Diagram

![Image](https://github.com/user-attachments/assets/06c0837e-7fd6-4c8d-829c-9453d83af0ce)

---

### Event Flow Sequence Diagram

![Image](https://github.com/user-attachments/assets/92993ddd-bccd-4eb0-8641-274ced972426)
    
  ---
  
### Key Technologies & Tools

-   **Backend Framework**: NestJS (TypeScript)
    
-   **Event Streaming**: Apache Kafka (via  `kafka.js`)
    
-   **Containerization**: Docker
    
-   **Orchestration**: Kubernetes (implied via IBM Cloud Code Engine)
    
-   **CI/CD**: GitHub Actions
    
-   **Cloud Deployment**: IBM Cloud (Code Engine, Event Streams)
    
-   **Authentication**: SASL/SSL for Kafka brokers
    
    
-   **Logging & Monitoring**: NestJS Logger, structured event tracking

---


### Architecture Workflow

#### 1.  **Service Breakdown**

-   **Customer Service**:
    
    -   REST API to create customers.
        
    -   Emits  `Customer.created`  Kafka events on successful registration.
        
-   **Transaction Service**:
    
    -   Processes financial transactions (debit/credit).
        
    -   Emits  `transaction.processed`  (success) or  `transaction.failed`  (error) events.
        
    -   Maintains in-memory account balances for demo purposes.
        
-   **Notification Service**:
    
    -   Listens to Kafka events (`Customer.created`,  `transaction.processed`,  `transaction.failed`).
        
    -   Sends emails/notifications based on event payloads (e.g., welcome emails, transaction alerts).
        

#### 2.  **Event-Driven Communication**

-   **Kafka Topics**:
    
    -   `Customer.created`: Triggered by customer registration.
        
    -   `transaction.requested`: Initiated for transaction processing.
        
    -   `transaction.processed`/`transaction.failed`: Outcomes of transaction processing.
        
-   **Asynchronous Workflow**:
    
    1.  A customer is created via  `customer-service`  →  `Customer.created`  event emitted.
        
    2.  `notification-service`  consumes the event → sends a welcome email.
        
    3.  A transaction request is sent to  `transaction-service`  → processed asynchronously.
        
    4.  On success/failure,  `transaction-service`  emits corresponding events →  `notification-service`  sends alerts.
        

#### 3.  **Kafka Configuration**

-   **Broker Setup**:
    
    -   Brokers are configured via  `EVENT_STREAMS_KAFKA_BROKERS_SASL`  environment variable (supports JSON or comma-separated strings).
        
    -   SASL/SSL authentication using  `EVENT_STREAMS_USER`  and  `EVENT_STREAMS_PASSWORD`.
        
-   **Reusable Utilities**:
    
    -   `KafkaConnectionUtils`  class standardizes Kafka client configuration (SSL, timeouts, retries) across services.
        

#### 4.  **Containerization & Deployment**

-   **Docker**:
    
    -   Each service has a dedicated  `Dockerfile`  optimized with multi-stage builds.
        
    -   Images are pushed to IBM Container Registry (`au.icr.io`).
        
-   **IBM Cloud Code Engine**:
    
    -   Services are deployed as serverless applications with auto-scaling.
        
    -   GitHub Actions automates build, push, and deployment steps on  `master`  branch updates.
        

#### 5.  **CI/CD Pipeline**

-   **GitHub Actions Workflow**:
    
    -   Checks out code, installs IBM Cloud CLI, and authenticates via API key.
        
    -   Builds/pushes Docker images for all services.
        
    -   Deploys updates to IBM Cloud Code Engine using  `ibmcloud ce`  commands.



## **Event-Driven Architecture with IBM Event Streams**




## **1. Clean Up Existing Resources**

Run the following commands to delete any existing applications:

```bash
ibmcloud ce application delete --name customer-service --force
ibmcloud ce application delete --name transaction-service --force
ibmcloud ce application delete --name notification-service --force

```

List all service instances in your IBM Cloud account:

```sh
ibmcloud resource service-instances

```

Retrieve details of your Event Streams instance:

```sh
ibmcloud resource service-instance my-event-streams --output json

```

----------

## **2. Create an Event Streams Instance**

```sh
ibmcloud resource service-instance-create my-event-streams messagehub standard au-syd

```

Verify and initialize the Event Streams instance:

```bash
ibmcloud es init -i my-event-streams

```

----------

## **3. Create Applications with Temporary Dummy Images**

### **Customer Service**

```bash
ibmcloud ce application create --name customer-service \
  --image nginx:alpine \
  --port 80 \
  --registry-secret icr-secret

```

### **Transaction Service**

```bash
ibmcloud ce application create --name transaction-service \
  --image nginx:alpine \
  --port 80 \
  --registry-secret icr-secret

```

### **Notification Service**

```bash
ibmcloud ce application create --name notification-service \
  --image nginx:alpine \
  --port 80 \
  --registry-secret icr-secret

```

----------

## **4. Bind Event Streams Service to Applications**

### **For Customer Service**

```bash
ibmcloud ce application bind --name customer-service \
  --service-instance my-event-streams \
  --prefix EVENT_STREAMS

```

### **For Transaction Service**

```bash
ibmcloud ce application bind --name transaction-service \
  --service-instance my-event-streams \
  --prefix EVENT_STREAMS

```

### **For Notification Service**

```bash
ibmcloud ce application bind --name notification-service \
  --service-instance my-event-streams \
  --prefix EVENT_STREAMS

```

Verify bindings:

```sh
ibmcloud ce application get --name notification-service

```

----------

## **5. Rebuild and Push Docker Images**

### **Rebuild with Updated Code**

```bash
docker build -t au.icr.io/mycodeengine/customer-service:latest -f Dockerfile.customer-service .
docker build -t au.icr.io/mycodeengine/transaction-service:latest -f Dockerfile.transaction-service .
docker build -t au.icr.io/mycodeengine/notification-service:latest -f Dockerfile.notification-service .

```

### **Push to IBM Cloud Container Registry**

```bash
docker push au.icr.io/mycodeengine/customer-service:latest
docker push au.icr.io/mycodeengine/transaction-service:latest
docker push au.icr.io/mycodeengine/notification-service:latest

```

----------

## **6. Update Applications with Real Images**

```bash
ibmcloud ce application update --name customer-service \
  --image au.icr.io/mycodeengine/customer-service:latest

ibmcloud ce application update --name transaction-service \
  --image au.icr.io/mycodeengine/transaction-service:latest

ibmcloud ce application update --name notification-service \
  --image au.icr.io/mycodeengine/notification-service:latest

```

----------

## **7. Test the Setup**


### **Produce Test Data**

### create a customer

```bash
curl -X POST http://customer-service/app/customers \
  -H "Content-Type: application/json" \
  -d '{"id": "cust-001", "name": "John Doe", "email": "john@example.com"}'

```

### **Initiate a Transaction**

```bash
curl -X POST http://transaction-service/transactions \
  -H "Content-Type: application/json" \
  -d '{"from": "cust-001", "to": "cust-002", "amount": 100, "transactionId": "txn-123"}
  ```

