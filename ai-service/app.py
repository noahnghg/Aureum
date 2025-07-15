from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import joblib
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

class TransactionCategorizer:
    def __init__(self):
        self.model = None
        self.categories = [
            'Food & Dining', 'Shopping', 'Transportation', 'Bills & Utilities',
            'Entertainment', 'Healthcare', 'Travel', 'Education', 
            'Personal Care', 'Financial', 'Other'
        ]
        self.subcategories = {
            'Food & Dining': ['Restaurants', 'Fast Food', 'Coffee Shops', 'Groceries'],
            'Shopping': ['Clothing', 'Electronics', 'Books', 'General Merchandise'],
            'Transportation': ['Gas Stations', 'Public Transportation', 'Taxi & Rideshare', 'Parking'],
            'Bills & Utilities': ['Phone', 'Internet', 'Electricity', 'Water', 'Insurance'],
            'Entertainment': ['Movies', 'Music', 'Games', 'Sports'],
            'Healthcare': ['Doctor', 'Pharmacy', 'Dentist', 'Medical Supplies'],
            'Travel': ['Flights', 'Hotels', 'Car Rental', 'Travel Insurance'],
            'Education': ['Tuition', 'Books', 'Supplies', 'Online Courses'],
            'Personal Care': ['Hair Care', 'Spa', 'Gym', 'Beauty Products'],
            'Financial': ['Bank Fees', 'Investment', 'Insurance', 'Taxes'],
            'Other': ['Miscellaneous']
        }
        self.load_or_create_model()
    
    def load_or_create_model(self):
        model_path = 'models/transaction_categorizer.joblib'
        if os.path.exists(model_path):
            logger.info("Loading existing model...")
            self.model = joblib.load(model_path)
        else:
            logger.info("Creating new model...")
            self.create_model()
    
    def create_model(self):
        # Create sample training data
        training_data = self.generate_training_data()
        
        # Create pipeline with TF-IDF and Naive Bayes
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=1000, stop_words='english')),
            ('classifier', MultinomialNB())
        ])
        
        # Train the model
        X_train, X_test, y_train, y_test = train_test_split(
            training_data['description'], 
            training_data['category'], 
            test_size=0.2, 
            random_state=42
        )
        
        self.model.fit(X_train, y_train)
        
        # Save the model
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.model, 'models/transaction_categorizer.joblib')
        
        logger.info(f"Model trained with accuracy: {self.model.score(X_test, y_test):.2f}")
    
    def generate_training_data(self):
        # Sample training data for transaction categorization
        training_data = []
        
        # Food & Dining
        food_descriptions = [
            'STARBUCKS', 'MCDONALDS', 'WHOLE FOODS', 'CHIPOTLE', 'SUBWAY',
            'PIZZA HUT', 'DOMINOS', 'KROGER', 'SAFEWAY', 'RESTAURANT',
            'CAFE', 'BISTRO', 'DINER', 'BAKERY', 'GROCERY'
        ]
        
        # Shopping
        shopping_descriptions = [
            'AMAZON', 'TARGET', 'WALMART', 'BEST BUY', 'MACY\'S',
            'NIKE', 'APPLE STORE', 'H&M', 'ZARA', 'COSTCO',
            'HOME DEPOT', 'LOWES', 'BARNES NOBLE'
        ]
        
        # Transportation
        transport_descriptions = [
            'SHELL', 'CHEVRON', 'EXXON', 'BP', 'UBER', 'LYFT',
            'METRO', 'BUS FARE', 'PARKING', 'TAXI', 'GAS STATION'
        ]
        
        # Bills & Utilities
        bills_descriptions = [
            'VERIZON', 'AT&T', 'COMCAST', 'ELECTRIC COMPANY', 'WATER DEPT',
            'INSURANCE', 'PHONE BILL', 'INTERNET', 'UTILITIES'
        ]
        
        # Add training examples
        for desc in food_descriptions:
            training_data.append({'description': desc, 'category': 'Food & Dining'})
        
        for desc in shopping_descriptions:
            training_data.append({'description': desc, 'category': 'Shopping'})
        
        for desc in transport_descriptions:
            training_data.append({'description': desc, 'category': 'Transportation'})
        
        for desc in bills_descriptions:
            training_data.append({'description': desc, 'category': 'Bills & Utilities'})
        
        return pd.DataFrame(training_data)
    
    def categorize(self, description):
        if not self.model:
            return {'category': 'Other', 'confidence': 0.5}
        
        try:
            prediction = self.model.predict([description])
            probabilities = self.model.predict_proba([description])
            confidence = max(probabilities[0])
            
            category = prediction[0]
            subcategory = self.get_subcategory(category, description)
            
            return {
                'category': category,
                'subcategory': subcategory,
                'confidence': float(confidence)
            }
        except Exception as e:
            logger.error(f"Error categorizing transaction: {e}")
            return {'category': 'Other', 'confidence': 0.5}
    
    def get_subcategory(self, category, description):
        # Simple rule-based subcategorization
        if category in self.subcategories:
            subcats = self.subcategories[category]
            description_upper = description.upper()
            
            # Match keywords to subcategories
            if category == 'Food & Dining':
                if any(word in description_upper for word in ['STARBUCKS', 'COFFEE', 'CAFE']):
                    return 'Coffee Shops'
                elif any(word in description_upper for word in ['MCDONALDS', 'BURGER', 'KFC', 'TACO BELL']):
                    return 'Fast Food'
                elif any(word in description_upper for word in ['WHOLE FOODS', 'KROGER', 'SAFEWAY', 'GROCERY']):
                    return 'Groceries'
                else:
                    return 'Restaurants'
            
            return subcats[0]  # Default to first subcategory
        
        return None

# Initialize the categorizer
categorizer = TransactionCategorizer()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'AI Model Service'})

@app.route('/analyze', methods=['POST'])
def analyze_transaction():
    try:
        data = request.get_json()
        
        if not data or 'transactions' not in data:
            return jsonify({'error': 'No transactions provided'}), 400
        
        transactions = data['transactions']
        results = []
        
        for transaction in transactions:
            description = transaction.get('description', '')
            amount = transaction.get('amount', 0)
            
            # Categorize the transaction
            categorization = categorizer.categorize(description)
            
            # Generate insights based on amount and category
            insights = generate_insights(amount, categorization['category'])
            
            result = {
                'transactionId': transaction.get('transactionId'),
                'category': categorization['category'],
                'subcategory': categorization.get('subcategory'),
                'confidence': categorization['confidence'],
                'insights': insights
            }
            
            results.append(result)
        
        return jsonify({'results': results})
    
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/insights', methods=['POST'])
def generate_spending_insights():
    try:
        data = request.get_json()
        
        if not data or 'transactions' not in data:
            return jsonify({'error': 'No transactions provided'}), 400
        
        transactions = data['transactions']
        user_id = data.get('userId')
        
        # Analyze spending patterns
        insights = analyze_spending_patterns(transactions)
        
        return jsonify({
            'userId': user_id,
            'insights': insights,
            'generatedAt': pd.Timestamp.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error generating insights: {e}")
        return jsonify({'error': 'Internal server error'}), 500

def generate_insights(amount, category):
    insights = []
    
    if amount > 100 and category == 'Entertainment':
        insights.append('High entertainment spending detected')
    
    if amount > 50 and category == 'Food & Dining':
        insights.append('Consider tracking restaurant expenses')
    
    if category == 'Bills & Utilities':
        insights.append('Regular bill payment')
    
    return insights

def analyze_spending_patterns(transactions):
    df = pd.DataFrame(transactions)
    
    if df.empty:
        return []
    
    insights = []
    
    # Category spending analysis
    category_spending = df.groupby('category')['amount'].sum().sort_values(ascending=False)
    top_category = category_spending.index[0] if not category_spending.empty else None
    
    if top_category:
        insights.append({
            'type': 'spending_pattern',
            'title': 'Top Spending Category',
            'description': f'You spent most in {top_category} category',
            'amount': float(category_spending[top_category])
        })
    
    # Average transaction amount
    avg_amount = df['amount'].mean()
    insights.append({
        'type': 'spending_average',
        'title': 'Average Transaction',
        'description': f'Your average transaction amount is ${avg_amount:.2f}',
        'amount': float(avg_amount)
    })
    
    # Transaction frequency
    transaction_count = len(df)
    insights.append({
        'type': 'transaction_frequency',
        'title': 'Transaction Activity',
        'description': f'You made {transaction_count} transactions in this period',
        'count': transaction_count
    })
    
    return insights

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
