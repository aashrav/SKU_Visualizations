from flask import Flask
from flask_mongoengine import MongoEngine
from flask_cors import CORS


db = MongoEngine()
app = Flask(__name__, static_folder='../../build', static_url_path='/')

app.config['MONGODB_HOST'] = 'mongodb+srv://aashrav:qwe@skuvision.dup3c.mongodb.net/SKUVision?retryWrites=true&w=majority'
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)

db.init_app(app)
    

from main import routing



"""
So right now this app is configured using a SQL database
If you want to use Mongo, then change the config file
as well as change the db initialization and install the 
correct libraries

This is the link I used to set all this up: https://www.digitalocean.com/community/tutorials/how-to-structure-large-flask-applications
so look at it for reference if you're unsure about something
"""