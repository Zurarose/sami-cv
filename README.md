# Sami CV - Next.js with Prisma

A Next.js project with PostgreSQL database using Prisma ORM.

## Getting Started

```bash
npm run dev
# Open http://localhost:3000
```

## 📊 Database & Prisma

### Quick Commands
```bash
# Development (fast, no migration files)
npx prisma db push          # Sync schema to database
npx prisma generate         # Generate TypeScript client

# Production (safe, with migration files)
npx prisma migrate dev --name description  # Create & apply migration
npx prisma migrate deploy   # Apply migrations in production

# Utilities
npx prisma studio          # Visual database browser
npx prisma db seed         # Run seed script
npx prisma migrate reset   # Reset database (⚠️ deletes data)
```

### Environment Setup
```bash
# .env.local
POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/mydb"
```

## 🏗️ Prisma Schema Reference

### Basic Structure
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url = env("POSTGRES_PRISMA_URL")
}
```

### Model Definition
```prisma
model User {
  // Primary Key
  id        String   @id @default(cuid())
  
  // Basic Fields
  name      String?                    // Optional
  email     String   @unique           // Required + unique
  role      Role     @default(USER)    // Enum with default
  
  // Timestamps
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  // Relations
  posts     Post[]                     // One-to-many
  profile   Profile?                   // One-to-one
  
  // Database mapping
  @@map("users")                       // Table name
  @@index([email])                     // Database index
}

enum Role {
  USER
  ADMIN
}
```

### Field Types & Attributes
```prisma
// Types
String    // Text
Int       // Integer
Float     // Decimal
Boolean   // True/false
DateTime  // Timestamp
Json      // JSON data
Bytes     // Binary data

// Modifiers
field String     // Required
field String?    // Optional
field String[]   // Array

// Attributes
@id                           // Primary key
@unique                       // Unique constraint
@default(value)              // Default value
@map("column_name")          // Custom column name
@db.VarChar(255)            // Database-specific type
@updatedAt                   // Auto-update timestamp
```

### Relations
```prisma
// One-to-Many
model User {
  posts Post[]
}
model Post {
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}

// Many-to-Many
model Post {
  categories Category[] @relation("PostCategories")
}
model Category {
  posts Post[] @relation("PostCategories")
}

// One-to-One
model User {
  profile Profile?
}
model Profile {
  userId Int  @unique
  user   User @relation(fields: [userId], references: [id])
}
```

## 🚀 Usage in Code

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create
const user = await prisma.user.create({
  data: {
    name: "John Doe",
    email: "john@example.com"
  }
})

// Read
const users = await prisma.user.findMany({
  where: { role: "USER" },
  include: { posts: true }
})

// Update
await prisma.user.update({
  where: { id: "123" },
  data: { name: "Jane Doe" }
})

// Delete
await prisma.user.delete({
  where: { id: "123" }
})
```

## 🔄 Database Migrations

### Two Migration Strategies

#### 🚀 Fast Development (`db push`)
```bash
# Quick prototyping - no migration files
npx prisma db push
npx prisma generate
```
- ✅ Instant schema sync
- ✅ Perfect for development
- ❌ No migration history
- ❌ Can cause data loss

#### 🛡️ Production Safe (`migrate`)
```bash
# Create versioned migration
npx prisma migrate dev --name add_user_table
npx prisma migrate deploy  # Production
```
- ✅ Version controlled
- ✅ Team collaboration safe
- ✅ Rollback capability
- ✅ Production ready

### Step-by-Step Migration Guide

#### 1. Initialize Migrations (First Time)
```bash
# If you haven't used migrations before
npx prisma migrate dev --name init
```

Creates:
```
prisma/
├── schema.prisma
└── migrations/
    └── 20231201120000_init/
        └── migration.sql
```

#### 2. Add New Field to Schema
```prisma
model User {
  id        String   @id @default(cuid())
  name      String?
  email     String?  @unique
  avatar    String?  // ← New field
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  @@map("users")
}
```

#### 3. Create Migration
```bash
npx prisma migrate dev --name add_user_avatar
```

**Generated migration** (`prisma/migrations/.../migration.sql`):
```sql
-- AlterTable
ALTER TABLE "users" ADD COLUMN "avatar" TEXT;
```

#### 4. Apply in Production
```bash
# Deploy to production database
npx prisma migrate deploy
npx prisma generate
```

### Common Migration Scenarios

#### Add Required Field with Default
```prisma
model User {
  status String @default("ACTIVE")  // Safe: has default
}
```

#### Add Required Field (Needs Data)
```sql
-- Custom migration.sql
ALTER TABLE "users" ADD COLUMN "username" TEXT;
UPDATE "users" SET "username" = 'user_' || "id";
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
```

#### Rename Column
```prisma
model User {
  fullName String? @map("name")  // Maps to existing column
}
```

#### Add Relation
```prisma
model User {
  posts Post[]  // Add relation
}

model Post {
  id       String @id @default(cuid())
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
```

### Migration Commands Reference

```bash
# Development
npx prisma migrate dev --name description  # Create & apply
npx prisma migrate reset                   # Reset DB (⚠️ data loss)
npx prisma migrate status                  # Check migration status

# Production
npx prisma migrate deploy                  # Apply pending migrations
npx prisma migrate resolve --applied NAME  # Mark as applied

# Utilities
npx prisma db pull                         # Introspect existing DB
npx prisma db seed                         # Run seed data
```

### Migration File Structure
```
prisma/migrations/
├── 20231201120000_init/
│   └── migration.sql
├── 20231201130000_add_user_avatar/
│   └── migration.sql
├── 20231201140000_add_post_model/
│   └── migration.sql
└── migration_lock.toml
```

### Team Collaboration Workflow

#### Developer A (creates migration):
```bash
# 1. Edit schema
# 2. Create migration
npx prisma migrate dev --name add_new_feature

# 3. Commit files
git add prisma/
git commit -m "🧼 chore: add user avatar field"
git push
```

#### Developer B (applies migration):
```bash
# 1. Pull changes
git pull

# 2. Apply new migrations
npx prisma migrate dev
npx prisma generate
```

### Production Deployment

#### Option 1: Manual Deployment
```bash
# On production server
git pull
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 restart app
```

#### Option 2: CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
- name: Run migrations
  run: |
    npx prisma migrate deploy
    npx prisma generate
```

### Migration Troubleshooting

#### Reset Development Database
```bash
npx prisma migrate reset  # ⚠️ Deletes all data
npx prisma db seed       # Restore seed data
```

#### Fix Failed Migration
```bash
# Mark migration as applied manually
npx prisma migrate resolve --applied 20231201130000_migration_name

# Or rollback and recreate
npx prisma migrate reset
npx prisma migrate dev --name fix_migration
```

#### Preview Migration
```bash
# See what would happen without applying
npx prisma migrate diff \
  --from-migrations ./prisma/migrations \
  --to-schema-datamodel ./prisma/schema.prisma
```

### Best Practices

- ✅ **Always backup production** before migrations
- ✅ **Test migrations** on staging environment first
- ✅ **Use descriptive names** for migrations
- ✅ **Commit both schema and migration files** together
- ✅ **Review generated SQL** before applying
- ❌ **Never edit migration files** after they're applied
- ❌ **Don't use `db push`** in production
- ❌ **Don't delete migration files** from git history

## 🎯 Best Practices

- Use `@@map()` for table names (`@@map("users")`)
- Use `@map()` for column names (`@map("created_at")`)
- Always include `createdAt` and `updatedAt` fields
- Use enums for fixed value sets
- Add indexes for frequently queried fields
- Use optional fields (`?`) when appropriate
- Commit migration files to version control

## Deployment

Deploy to Vercel:
```bash
vercel deploy
```

---

Built with [Next.js](https://nextjs.org) and [Prisma](https://prisma.io)
