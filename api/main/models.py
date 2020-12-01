from main import db
from bson.objectid import ObjectId

class User(db.Document):
  email = db.StringField(required=True)
  name = db.StringField()
  corporate_id = db.ObjectIdField()
  password = db.StringField()


class File(db.EmbeddedDocument):
  file_ = db.FileField()

class MasterFile(db.EmbeddedDocument):
  file_composition = db.ListField(db.ObjectIdField())
  file = db.FileField()


class Corporate(db.Document):
  corporate_name = db.StringField(unique = True)
  corporate_id = db.StringField()

  uploadedFiles = db.ListField(db.EmbeddedDocumentField(File), default = [])
  masterFiles = db.ListField(db.EmbeddedDocumentField(MasterFile), default = [])


