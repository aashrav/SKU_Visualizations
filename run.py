  import sys

if __name__ == "__main__":
  sys.path.insert(0, 'api')
  from app import app
  app.run(debug=True)
