// Initialize MongoDB database and collections for Aureum

// Switch to aureum_transactions database
db = db.getSiblingDB('aureum_transactions');

// Create collections with validation schemas

// Transactions collection
db.createCollection('transactions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'transactionId', 'amount', 'date', 'description'],
      properties: {
        userId: {
          bsonType: 'int',
          description: 'User ID from PostgreSQL users table'
        },
        transactionId: {
          bsonType: 'string',
          description: 'Unique transaction identifier from bank'
        },
        accountId: {
          bsonType: 'string',
          description: 'Bank account identifier'
        },
        amount: {
          bsonType: 'double',
          description: 'Transaction amount'
        },
        date: {
          bsonType: 'date',
          description: 'Transaction date'
        },
        description: {
          bsonType: 'string',
          description: 'Transaction description'
        },
        category: {
          bsonType: 'string',
          description: 'AI-categorized transaction category'
        },
        subcategory: {
          bsonType: 'string',
          description: 'AI-categorized transaction subcategory'
        },
        merchantName: {
          bsonType: 'string',
          description: 'Merchant name if available'
        },
        location: {
          bsonType: 'object',
          properties: {
            address: { bsonType: 'string' },
            city: { bsonType: 'string' },
            region: { bsonType: 'string' },
            postalCode: { bsonType: 'string' },
            country: { bsonType: 'string' },
            latitude: { bsonType: 'double' },
            longitude: { bsonType: 'double' }
          }
        },
        isRecurring: {
          bsonType: 'bool',
          description: 'Whether this is a recurring transaction'
        },
        confidence: {
          bsonType: 'double',
          minimum: 0,
          maximum: 1,
          description: 'AI categorization confidence score'
        },
        tags: {
          bsonType: 'array',
          items: { bsonType: 'string' },
          description: 'User-defined or AI-generated tags'
        },
        metadata: {
          bsonType: 'object',
          description: 'Additional transaction metadata'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Record creation timestamp'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Record last update timestamp'
        }
      }
    }
  }
});

// Spending patterns collection
db.createCollection('spending_patterns', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'period', 'patterns'],
      properties: {
        userId: {
          bsonType: 'int',
          description: 'User ID from PostgreSQL users table'
        },
        period: {
          bsonType: 'string',
          enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
          description: 'Analysis period'
        },
        startDate: {
          bsonType: 'date',
          description: 'Period start date'
        },
        endDate: {
          bsonType: 'date',
          description: 'Period end date'
        },
        patterns: {
          bsonType: 'object',
          description: 'Analyzed spending patterns'
        },
        insights: {
          bsonType: 'array',
          items: { bsonType: 'string' },
          description: 'Generated insights'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Record creation timestamp'
        }
      }
    }
  }
});

// Create indexes for optimal query performance

// Transactions collection indexes
db.transactions.createIndex({ 'userId': 1 });
db.transactions.createIndex({ 'transactionId': 1 }, { unique: true });
db.transactions.createIndex({ 'userId': 1, 'date': -1 });
db.transactions.createIndex({ 'userId': 1, 'category': 1 });
db.transactions.createIndex({ 'userId': 1, 'amount': 1 });
db.transactions.createIndex({ 'date': -1 });
db.transactions.createIndex({ 'category': 1, 'date': -1 });
db.transactions.createIndex({ 'merchantName': 1 });
db.transactions.createIndex({ 'isRecurring': 1, 'userId': 1 });

// Spending patterns collection indexes
db.spending_patterns.createIndex({ 'userId': 1 });
db.spending_patterns.createIndex({ 'userId': 1, 'period': 1 });
db.spending_patterns.createIndex({ 'userId': 1, 'startDate': -1 });

// Insert sample categories for reference
db.transaction_categories.insertMany([
  { name: 'Food & Dining', subcategories: ['Restaurants', 'Fast Food', 'Coffee Shops', 'Groceries'] },
  { name: 'Shopping', subcategories: ['Clothing', 'Electronics', 'Books', 'General Merchandise'] },
  { name: 'Transportation', subcategories: ['Gas Stations', 'Public Transportation', 'Taxi & Rideshare', 'Parking'] },
  { name: 'Bills & Utilities', subcategories: ['Phone', 'Internet', 'Electricity', 'Water', 'Insurance'] },
  { name: 'Entertainment', subcategories: ['Movies', 'Music', 'Games', 'Sports'] },
  { name: 'Healthcare', subcategories: ['Doctor', 'Pharmacy', 'Dentist', 'Medical Supplies'] },
  { name: 'Travel', subcategories: ['Flights', 'Hotels', 'Car Rental', 'Travel Insurance'] },
  { name: 'Education', subcategories: ['Tuition', 'Books', 'Supplies', 'Online Courses'] },
  { name: 'Personal Care', subcategories: ['Hair Care', 'Spa', 'Gym', 'Beauty Products'] },
  { name: 'Financial', subcategories: ['Bank Fees', 'Investment', 'Insurance', 'Taxes'] }
]);

print('MongoDB initialization completed for Aureum transactions database');
