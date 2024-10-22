# Kafka Producer from JSON File

A Node.js application written in TypeScript that reads messages from a JSON file and produces them to a Kafka topic. The application expects each line in the input file to be a valid JSON object containing message details.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Access to a Kafka broker
- Input file with JSON messages

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=json-file-producer
KAFKA_GROUP_ID=producer-group-1
KAFKA_TOPIC=your-topic-name
MESSAGES_FILE_INPUT=path/to/your/input/file.json
```

### Environment Variables

- `KAFKA_BROKERS`: Comma-separated list of Kafka brokers
- `KAFKA_CLIENT_ID`: Client identifier for this producer
- `KAFKA_GROUP_ID`: Producer group identifier
- `KAFKA_TOPIC`: Topic to produce messages to (can be overridden via command line argument)
- `MESSAGES_FILE_INPUT`: Path to the input file containing messages

## Input File Format

The input file should contain one JSON object per line (newline-delimited JSON), with each object having the following structure:
```json
{
  "partition": number,
  "offset": string,
  "key": string,
  "value": string
}
```

Only the `key` and `value` fields will be used when producing messages to Kafka. The `partition` and `offset` fields are ignored but must be present in the JSON structure.

## Usage

Run the application using:

```bash
npx ts-node index.ts [topic-name]
```

The `topic-name` argument is optional. If not provided, the application will use the topic specified in the `.env` file.

## Project Structure

- `index.ts` - Main application file containing Kafka producer logic
- `utils.ts` - Utility functions for logging
- `package.json` - Project dependencies and configuration
- `.env` - Environment variables configuration

## Dependencies

- `kafkajs` - Kafka client for Node.js
- `dotenv` - Environment variables management
- `typescript` - TypeScript language support
- `ts-node` - TypeScript execution environment

## Development

To modify the project:

1. Install development dependencies:
```bash
npm install --save-dev typescript ts-node
```

2. Make your changes to the TypeScript files
3. Run the application using `npx ts-node index.ts`

## Error Handling

The application will exit with code 1 if:
- Any required configuration parameters are missing
- The input file cannot be read
- The input file contains invalid JSON
- There are connection issues with the Kafka broker

Required parameters are:
- Kafka brokers
- Client ID
- Group ID
- Topic name
- Input file path

## Logging

The application logs operations with timestamps using the format:
```
{timestamp} [INFO] {message}
```

Log messages include:
- Configuration status
- Producer initialization
- Message processing status
- Any errors that occur during execution

## Use Cases

This producer is particularly useful for:
- Replaying messages from a backed-up consumer
- Testing Kafka consumer applications
- Migrating messages between Kafka topics
- Load testing Kafka consumers

## Notes

- The application processes messages sequentially, reading each line from the input file and producing it to Kafka
- Empty lines in the input file are skipped
- The original partition information from the input file is not used; Kafka will handle message partitioning according to its configuration
