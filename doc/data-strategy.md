# Data and Database Strategy for Alice

This document outlines the strategy. It's not written in stone and defines a direction. It's here to help me make future proof decisions, but not to implement too much too early.

Alice follows a local-first and privacy-first approach. It's the end user's decision what information is sent where. So any data management plan needs to handle that data may be fragmented and synced between server and browser in part or in whole.

Each assistant's data is logically isolated from the others. There should be no queries that need data from multiple assistants, even on a multi-user backend.

## Preferred Data Structure

Data should be stored in the format that makes sense without any dogma. As each assistant has their own data, the total data should not grow outside the realms that are quick to migrate.

But prefer to store data as a change log or series of events, with a materialized view.
* Append big non-destructive changes. (From LLM training)
* Easy point-in-time restore and undo.

If the events can be defined in a robust and idempotent way, then that unlocks easy syncing and patchwork changes.

## Schema Versioning

We plan to start using SurrealDB for data storage. It's a very good database for early experimentation and fast prototyping. But it's a new and not very mature database, so versioning and migration need to be done in the application layer. Changing database technology may happen.

There should be a document stored in a known location that defines the current schema version. The format must be both forward and backward compatible.

The version itself is a simple unsigned integer. Version 1 is the first version. Version 0 is for development and experimental purposes. That is not valid for production use. Development versions just assume the schema is valid.

We should have different versions for logically separated data that have their own lifecycle and stability needs, and can have their own migration strategy.

We will start with 2 versions:
1. App - The source of truth for the application data. Hopefully mostly event logs, and should be relatively stable, or at least not change too often. The reason for the generic name is so that it's easy to add more versions later.
2. View - Materialized views. This data can always be regenerated from the app data, but allows for faster access and easier queries. Use the query power of the database of choice.

As a general rule of thumb, if there is a high risk that data should have its own dedicated database in the future, then it could be its own version. But err on the side of fewer versions, as each version adds complexity to the system.

Example:
```json
{
  "meta_version": 1, // The version of the versioning schema.
  "app": {
    "version": 1,
    "last_migrated_by": "surrealdb:1.0.0",
    "last_written_by": "surrealdb:1.0.0"
  },
  "views": {
    "version": 1,
    "last_migrated_by": "surrealdb:1.0.0",
    "last_written_by": "surrealdb:1.0.0"
  }
}
```

Any production system must never write to any version that is newer than itself, nor read from version 0. For app data, it should try to upgrade to the latest version, but only in a safe and tested way. Backups before any migration are a must. Views should just be regenerated if the version doesn't match.

Development systems can only use version 0. If we need to debug a production system, we need to manually set the version to 0, preferably on a copy of the data.

Migration tests can of course use any version, but they should never run on anything even remotely close to production data.

**Version 0 does not mitigate data loss, it guarantees it.**

## Backup and Restore

Backups should be made at the application level, in an easy and well-supported format like JSON/JSONL. SurrealDB does not have a good backup and restore story, and I do not want to be locked into a specific database technology. Also, this allows simple save and restore for browser-only users.

Backups are done assistant by assistant, even on multi-user servers. This allows us to forget users entirely and respect the local-first and privacy-first design.

## Implementation Plan

Doing database management right is a lot of work, and doing it all now would kill any momentum. So we will do it in stages.

### Prototype Stage

Pin all versions to 0. Use SurrealDB as the only database. Do not do any migrations, but write the logic that blocks any version that is not 0.

### When I Start Using It Daily

Define versions 1 for app and views, and write the scaffolding for migration even if we do not use it yet. Now need to be very careful with schema changes, as that now adds complexity to the system.

#### When I Am Afraid of Data Loss

Define the backup and restore logic, and write the code to do backups on a regular basis.
