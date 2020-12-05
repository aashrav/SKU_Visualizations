from flask import Flask
from flask_mongoengine import MongoEngine
from flask_cors import CORS

db = MongoEngine()
app = Flask(__name__, static_folder='../../build', static_url_path='/')

app.config['MONGODB_HOST'] = 'mongodb+srv://aashrav:qwe@skuvision.dup3c.mongodb.net/SKUVision?retryWrites=true&w=majority'
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)

db.init_app(app)
    
from app import routing

