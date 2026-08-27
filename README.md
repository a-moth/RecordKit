# RecordKit

RecordKit is a local-first, template-driven data journal. You define the structure of the information you want to keep, then create records from that structure over time.

Instead of deciding in advance that everyone is tracking the same symptoms, habits, foods, sources, or events, RecordKit lets each user describe the data that matters to them.

## Why RecordKit exists

RecordKit began from a need for a free, flexible way to manage and eventually analyse many kinds of personal data without giving control of that data to a hosted service.

Its primary audience is technically comfortable disabled users who want a better way to track symptoms, activities, and changes over time. The same configurable model can also support personal history, food logging, structured journals, citation records, and other forms of personal data collection.

## How it works

A **template** defines a reusable structure. It can contain text, numbers, dates, times, durations, selections, scales, booleans, image booleans, and nested sections.

An **entry** is one completed record created from a template. The template determines which fields the entry contains, while the entry holds the values recorded on that occasion.

Fields and sections are both represented as nodes in an ordered tree. This allows a template to be as simple as one value or as detailed as a deeply organised record.

## Local-first data ownership

RecordKit stores core data on the user's device and has no RecordKit-controlled server. Data is not automatically synced or transmitted. Future integrations with services such as Google Health Connect, Apple HealthKit, or general third-party APIs must be explicitly configured and controlled by the user.

Import and export are intended to keep RecordKit data usable outside RecordKit. The project is open source, free, and has no in-app subscription or paywall model.

## Portability and future direction

RecordKit currently uses Expo and React Native. The roadmap calls for migration to a React + Vite progressive web application before version 2.0, followed by local-first analytics. A later local-host-only API is intended to support programmatic management of user-owned data.

See [PLANNING.md](PLANNING.md) for version ownership and current scope; future plans are direction, not permission to implement features early.

## Current status

- Latest released version: **1.0**
- Current development target: **1.1**
- Current focus: comprehensive white-box coverage for the released product

## Documentation

- [Use RecordKit](user-docs/index.md)
- [Contribute](CONTRIBUTING.md)
- [Architecture](docs/architecture/README.md)
- [Testing](docs/testing/README.md)
- [Programmatic reference](docs/api-reference/README.md)
- [Roadmap and project direction](PLANNING.md)

