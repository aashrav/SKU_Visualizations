# import sys

# if __name__ == "__main__":
#   sys.path.insert(0, 'api')
#   from app import app
#   app.run(debug=True)

from flask import Flask

my_awesome_app = Flask(__name__)


@my_awesome_app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    my_awesome_app.run()